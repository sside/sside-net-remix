import { InternalServerError, NotFoundServerError, UnprocessableServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { Logger } from "../../libraries/logger/logger";
import { validateBlogEntryMetaTags } from "../../libraries/vallidator/validateBlogEntryMetaTag";
import { validateBlogEntrySlug } from "../../libraries/vallidator/validateBlogEntrySlug";
import { validateBlogEntryTitle } from "../../libraries/vallidator/validateBlogEntryTitle";
import { upsertBlogMetaTags } from "../blog-meta-tag/blogMetaTag.server";
import { PrismaJoinedBlogEntry } from "./types/prisma/PrismaJoinedBlogEntry";
import { PrismaPublishedBlogEntry } from "./types/prisma/PrismaPublishedBlogEntry";

const logger = new Logger("blogEntry");

export async function findOneBlogEntryById(id: string): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Find a blog entry`, {
        id,
    });

    if (!id) {
        throw new InternalServerError(`Blog entry id is not defined.`);
    }

    const blogEntry = await prisma.blogEntry.findUnique({
        where: {
            id: id,
        },
        include: {
            blogEntryBodies: true,
            blogEntryBodyDraft: true,
            blogMetaTags: true,
        },
    });

    if (!blogEntry) {
        throw new NotFoundServerError(`Blog entry was not found. Id: ${id}`);
    }

    return blogEntry;
}

export async function findManyBlogEntryRecentPublished(count: number): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`Find recent published blog entries.`, {
        count,
    });

    return await prisma.blogEntry.findMany({
        where: {
            publishAt: {
                not: null,
            },
        },
        include: {
            blogEntryBodies: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: "desc",
        },
        take: count,
    });
}

export async function findAllBlogEntries(): Promise<PrismaJoinedBlogEntry[]> {
    logger.log(`Find all exist blog entries.`);

    return await prisma.blogEntry.findMany({
        include: {
            blogEntryBodies: true,
            blogMetaTags: true,
            blogEntryBodyDraft: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function findAllBlogEntryOnlyPublishedAt(): Promise<Date[]> {
    logger.log(`Find all published blog dates.`);

    return (
        await prisma.blogEntry.findMany({
            where: {
                publishAt: {
                    not: null,
                },
            },
            select: {
                publishAt: true,
            },
        })
    ).map(({ publishAt }) => publishAt!);
}

export async function publishBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
    publishAt?: Date,
): Promise<PrismaJoinedBlogEntry> {
    if (id) {
        return publishExistBlogEntry(id, title, slug, body, tags, publishAt);
    } else {
        return publishNewBlogEntry(title, slug, body, tags, publishAt);
    }
}

export async function upsertBlogEntryDraft(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Create or update draft blog entry.`, {
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
    logger.log(`Delete blog entry.`, {
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

function validatePublishBlogEntry(title: string, slug: string, body: string, tags: string[]): void {
    const errorMessages = [
        validateBlogEntryTitle(title),
        validateBlogEntrySlug(slug),
        validateBlogEntryMetaTags(tags),
    ].filter((value) => typeof value === "string");
    if (errorMessages.length) {
        throw new UnprocessableServerError(`Validation error. Error messages:${errorMessages.join(", ")}`);
    }
}

async function publishNewBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    publishAt?: Date,
): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Publish new blog entry.`, {
        title,
        slug,
        body,
        tags,
        publishAt,
    });

    validatePublishBlogEntry(title, slug, body, tags);
    const created = await prisma.blogEntry.create({
        data: {
            slug,
            publishAt: publishAt || new Date(),
            blogEntryBodies: {
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
    logger.log(`Publish exist blog entry.`, {
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
        throw new NotFoundServerError(`Exist entry was not found. Id: ${id}`);
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
            publishAt: publishAt || existBlogEntry.publishAt || new Date(),
            blogEntryBodies: {
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
