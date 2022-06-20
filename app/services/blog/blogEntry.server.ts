import { InternalServerError, NotFoundServerError, UnprocessableServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { Logger } from "../../libraries/logger/logger";
import { isValidMetaTags } from "../../libraries/vallidator/isValidMetaTag";
import { isValidSlug } from "../../libraries/vallidator/isValidSlug";
import { isValidTitle } from "../../libraries/vallidator/isValidTitle";
import { upsertBlogMetaTags } from "./blogMetaTags.server";
import { JoinedBlogEntry } from "./types/JoinedBlogEntry";

const logger = new Logger("BlogEntry");

export async function findOneBlogEntryById(id: string): Promise<JoinedBlogEntry> {
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

export async function findAllBlogEntries(): Promise<JoinedBlogEntry[]> {
    return await prisma.blogEntry.findMany({
        include: {
            blogEntryBodies: true,
            blogMetaTags: true,
            blogEntryBodyDraft: true,
        },
    });
}

export async function publishBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
    publishAt?: Date,
): Promise<JoinedBlogEntry> {
    if (id) {
        return publishExistBlogEntry(id, title, slug, body, tags, publishAt);
    } else {
        return publishNewBlogEntry(title, slug, body, tags, publishAt);
    }
}

export async function upsertDraftBlogEntry(
    title: string,
    slug: string,
    body: string,
    tags: string[],
    id?: string,
): Promise<JoinedBlogEntry> {
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

function validatePublishBlogEntry(title: string, slug: string, body: string, tags: string[]): void {
    const errorMessages = [isValidTitle(title), isValidSlug(slug), isValidMetaTags(tags)].filter(
        (value) => typeof value === "string",
    );
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
): Promise<JoinedBlogEntry> {
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
): Promise<JoinedBlogEntry> {
    validatePublishBlogEntry(title, slug, body, tags);
    const existBlogEntry = await prisma.blogEntry.findUnique({
        where: {
            id,
        },
    });
    if (!existBlogEntry) {
        throw new NotFoundServerError(`Exist entry was not found. Id: ${id}`);
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
            blogEntryBodyDraft: {
                delete: true,
            },
            blogMetaTags: {
                connect: (await upsertBlogMetaTags(tags)).map(({ id }) => ({ id })),
            },
        },
    });

    return await findOneBlogEntryById(updated.id);
}
