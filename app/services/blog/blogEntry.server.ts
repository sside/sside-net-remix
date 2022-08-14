import { Prisma } from "@prisma/client";
import {
    InternalServerError,
    NotFoundServerError,
    toErrorResponse,
    UnprocessableServerError,
} from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { Logger } from "../../libraries/logger/logger";
import { validateBlogEntryMetaTags } from "../../libraries/vallidator/validateBlogEntryMetaTag";
import { validateBlogEntrySlug } from "../../libraries/vallidator/validateBlogEntrySlug";
import { validateBlogEntryTitle } from "../../libraries/vallidator/validateBlogEntryTitle";
import { upsertBlogMetaTags } from "../blog-meta-tag/blogMetaTag.server";
import { PrismaJoinedBlogEntry } from "./types/prisma/PrismaJoinedBlogEntry";

const logger = new Logger("blogEntry");

export async function findOneBlogEntryById(id: string): Promise<PrismaJoinedBlogEntry> {
    logger.log(`IdでBlog entryを検索します。`, {
        id,
    });

    if (!id) {
        throw new InternalServerError(`Blog entryのidが未定義です。`);
    }

    const blogEntry = await findUnique({
        id,
    });

    if (!blogEntry) {
        throw toErrorResponse(
            new NotFoundServerError(`Blog entryが見つかりませんでした。`, {
                id,
            }),
        );
    }

    return blogEntry;
}

export async function findAllBlogEntries(): Promise<PrismaJoinedBlogEntry[]> {
    logger.log(`全てのBlog entryを返します。`);

    return await findMany({
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function publishBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
): Promise<PrismaJoinedBlogEntry> {
    return await (id
        ? publishExistBlogEntry(id, title, slug, body, tags)
        : publishNewBlogEntry(title, slug, body, tags));
}

export async function upsertBlogEntryDraft(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Blog entryの下書きをUPSERTします。`, {
        id,
        title,
        slug,
        body,
        tags,
        operation: id ? "update" : "create",
    });

    validatePublishBlogEntry(title, slug, body, tags);

    const blogEntry = await (id
        ? findOneBlogEntryById(id)
        : prisma.blogEntry.create({
              data: {
                  slug,
              },
          }));
    const updatedBlogEntry = await prisma.blogEntry.update({
        where: {
            id: blogEntry.id,
        },
        data: {
            blogEntryBodyDraft: {
                upsert: {
                    update: {
                        body,
                        title,
                    },
                    create: {
                        body,
                        title,
                    },
                },
            },
            blogMetaTags: {
                connect: (await upsertBlogMetaTags(tags)).map(({ id }) => ({ id })),
            },
        },
    });

    return await findOneBlogEntryById(updatedBlogEntry.id);
}

export async function deleteOneBlogEntryById(id: string): Promise<void> {
    logger.log(`Blog entryを削除します。`, {
        id,
    });

    // Just check exists.
    const exist = await findOneBlogEntryById(id);

    await prisma.blogEntry.delete({
        where: {
            id: exist.id,
        },
    });
}

async function findUnique(where: Prisma.BlogEntryWhereUniqueInput): Promise<PrismaJoinedBlogEntry | null> {
    return await prisma.blogEntry.findUnique({
        where,
        include: {
            blogEntryBodyHistories: true,
            blogEntryBodyDraft: true,
            blogMetaTags: true,
        },
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function findFirst(args?: Prisma.BlogEntryFindFirstArgs): Promise<PrismaJoinedBlogEntry | null> {
    return await prisma.blogEntry.findFirst({
        ...args,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
            blogEntryBodyDraft: true,
        },
    });
}

async function findMany(args?: Prisma.BlogEntryFindManyArgs): Promise<PrismaJoinedBlogEntry[]> {
    return await prisma.blogEntry.findMany({
        ...args,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
            blogEntryBodyDraft: true,
        },
    });
}

function validatePublishBlogEntry(title: string, slug: string, body: string, tags: string[]): void {
    const errorMessages = [
        validateBlogEntryTitle(title),
        validateBlogEntrySlug(slug),
        validateBlogEntryMetaTags(tags),
    ].filter((value) => typeof value === "string");
    if (errorMessages.length) {
        throw new UnprocessableServerError(`Blog entryのバリデーションに失敗しました。`, {
            errorMessages: errorMessages.join(", "),
        });
    }
}

async function publishNewBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Blog entryを新規作成、公開します。`, {
        title,
        slug,
        body,
        tags,
    });

    validatePublishBlogEntry(title, slug, body, tags);
    const created = await prisma.blogEntry.create({
        data: {
            slug,
            publishAt: new Date(),
            blogEntryBodyHistories: {
                create: {
                    title,
                    body,
                },
            },
            blogMetaTags: {
                connect: (await upsertBlogMetaTags(tags)).map(({ id }) => ({ id })),
            },
        },
    });
    return await findOneBlogEntryById(created.id);
}

async function publishExistBlogEntry(
    id: string,
    title: string,
    slug: string,
    body: string,
    tags: string[],
    publishAt?: Date,
): Promise<PrismaJoinedBlogEntry> {
    logger.log(`既存のBlog entryを公開します。`, {
        id,
        title,
        slug,
        body,
        tags,
        publishAt,
    });

    validatePublishBlogEntry(title, slug, body, tags);
    const existBlogEntry = await prisma.blogEntry.findUnique({
        where: {
            id,
        },
        include: {
            blogEntryBodyDraft: true,
        },
    });
    if (!existBlogEntry) {
        throw toErrorResponse(
            new NotFoundServerError(`Blog entryが見つかりませんでした。`, {
                id,
            }),
        );
    }

    if (existBlogEntry.blogEntryBodyDraft) {
        await prisma.blogEntryBodyDraft.delete({
            where: {
                id: existBlogEntry.blogEntryBodyDraft.id,
            },
        });
    }

    const updated = await prisma.blogEntry.update({
        where: {
            id,
        },
        data: {
            publishAt: existBlogEntry.publishAt || new Date(),
            blogEntryBodyHistories: {
                create: {
                    body,
                    title,
                },
            },
            blogMetaTags: {
                connect: (await upsertBlogMetaTags(tags)).map(({ id }) => ({ id })),
            },
        },
    });

    return await findOneBlogEntryById(updated.id);
}
