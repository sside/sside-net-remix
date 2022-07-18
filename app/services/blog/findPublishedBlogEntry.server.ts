import { BlogEntry, Prisma } from "@prisma/client";
import { NotFoundServerError, UnprocessableServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { createMonthRange, createYearRange } from "../../libraries/datetime";
import { Logger } from "../../libraries/logger/logger";
import { QuerySortOrder } from "../../types/QuerySortOrder";
import { NextBlogEntryDirection } from "./constants/NextBlogEntryDirection";
import { PrismaJoinedBlogEntry } from "./types/prisma/PrismaJoinedBlogEntry";
import { PrismaPublishedBlogEntry } from "./types/prisma/PrismaPublishedBlogEntry";

const logger = new Logger("findPublishedBlogEntry");

export async function findOnePublishedBlogEntryById(id: string): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Find a blog entry by id`, {
        id,
    });

    const blogEntry = await prisma.blogEntry.findUnique({
        where: {
            id,
        },
        include: {
            blogEntryBodyHistories: true,
            blogEntryBodyDraft: true,
            blogMetaTags: true,
        },
    });

    if (!blogEntry || !isPublished(blogEntry)) {
        throw new NotFoundServerError(`Blog entry was not found.`, {
            id,
        });
    }

    return blogEntry;
}

export async function findOnePublishedBlogEntryBySlug(slug: string): Promise<PrismaJoinedBlogEntry> {
    logger.log(`Find a blog entry by slug`, {
        slug,
    });

    const blogEntry = await prisma.blogEntry.findUnique({
        where: {
            slug,
        },
        include: {
            blogEntryBodyHistories: true,
            blogEntryBodyDraft: true,
            blogMetaTags: true,
        },
    });

    if (!blogEntry || !isPublished(blogEntry)) {
        throw new NotFoundServerError(`Blog entry was not found.`, {
            slug,
        });
    }

    return blogEntry;
}

export async function findOnePublishedBlogEntryNextSameMetaTagByAndId(
    metaTagName: string,
    blogEntryId: string,
    direction: NextBlogEntryDirection,
): Promise<PrismaPublishedBlogEntry> {
    logger.log(`Find both side of specified blog entry has same meta tag.`, {
        metaTagName,
        blogEntryId,
        direction,
    });
    const { publishAt: existPublishAt } = await findOnePublishedBlogEntryById(blogEntryId);

    const order = getOrderByDirection(direction);
    const nextBlogEntry = await prisma.blogEntry.findFirst({
        where: {
            ...createWhereQueryPublishAtThreshold(order, existPublishAt!),
            blogMetaTags: {
                some: {
                    name: metaTagName,
                },
            },
        },
        orderBy: {
            publishAt: order,
        },
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
    });

    if (!nextBlogEntry) {
        throw new NotFoundServerError(`Next meta tag entry not found.`, {
            blogEntryId,
            direction,
        });
    }

    return nextBlogEntry;
}
export async function findBothSidePublishedBlogEntry(
    pointerId: string,
): Promise<[PrismaPublishedBlogEntry | null, PrismaPublishedBlogEntry | null]> {
    const { Old, Young } = NextBlogEntryDirection;

    const [old, young] = (
        await Promise.allSettled([
            findOnePublishedBlogEntryNext(pointerId, Old),
            findOnePublishedBlogEntryNext(pointerId, Young),
        ])
    ).map((result) => (result.status === "fulfilled" ? result.value : null));

    return [old, young];
}
export async function findManyPublishedBlogEntryRecent(count: number): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`Find recent published blog entries.`, {
        count,
    });

    return await prisma.blogEntry.findMany({
        where: createWhereQueryOnlyPublished(),
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: "desc",
        },
        take: count,
    });
}
export async function findManyPublishedBlogEntryByPaging(
    pointerId: string,
    order: QuerySortOrder,
    limit: number,
    year?: number,
    month?: number,
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`Find entries by paging info`, {
        pointerId,
        order,
        limit,
        year,
        month,
    });

    if (month && !year) {
        throw new UnprocessableServerError(`Year is not defined but month is defined.`, {
            month,
            year,
        });
    }

    const { publishAt } = await findOnePublishedBlogEntryById(pointerId);

    const whereQuery = createWhereQueryOnlyPublished();
    whereQuery.AND = [createWhereQueryPublishAtThreshold(order, publishAt!)];

    if (year) {
        const [queryStart, queryEnd] = month ? createMonthRange(year, month) : createYearRange(year);

        whereQuery.AND.push({
            publishAt: {
                gte: queryStart,
                lte: queryEnd,
            },
        });
    }

    return prisma.blogEntry.findMany({
        where: whereQuery,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: order,
        },
        take: limit,
    });
}
export async function findManyPublishedBlogEntryByMetaTagName(
    metaTagName: string,
    limit: number,
    pointerId?: string,
    order: QuerySortOrder = "desc",
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`Find published blog entries by meta tag name`, {
        metaTagName,
        limit,
        pointerId,
        order,
    });

    const blogEntryWhere: Prisma.BlogEntryWhereInput[] = [createWhereQueryOnlyPublished()];

    if (pointerId) {
        const { publishAt } = await findOnePublishedBlogEntryById(pointerId);
        blogEntryWhere.push(createWhereQueryPublishAtThreshold(order, publishAt!));
    }

    return await prisma.blogEntry.findMany({
        where: {
            AND: blogEntryWhere,
            blogMetaTags: {
                some: {
                    name: metaTagName,
                },
            },
        },
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: order,
        },
        take: limit,
    });
}

export async function findAllBlogEntryOnlyPublishAt(): Promise<Date[]> {
    logger.log(`Find all published blog dates.`);
    return (
        await prisma.blogEntry.findMany({
            where: createWhereQueryOnlyPublished(),
            select: {
                publishAt: true,
            },
        })
    ).map(({ publishAt }) => publishAt!);
}

async function findOnePublishedBlogEntryNext(
    pointerId: string,
    direction: NextBlogEntryDirection,
): Promise<PrismaPublishedBlogEntry> {
    logger.log(`Find published blog entry after pointer`, {
        pointerId,
        direction,
    });
    const { publishAt } = await findOnePublishedBlogEntryById(pointerId);

    const order = getOrderByDirection(direction);
    const next = await prisma.blogEntry.findFirst({
        where: {
            ...createWhereQueryPublishAtThreshold(order, publishAt!),
        },
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: order,
        },
    });

    if (!next) {
        throw new NotFoundServerError(`Next blog entry not found.`, {
            pointerId,
            direction,
        });
    }
    return next;
}

function createWhereQueryOnlyPublished(): Prisma.BlogEntryWhereInput {
    return {
        publishAt: {
            lte: new Date(),
        },
    };
}

function createWhereQueryPublishAtThreshold(order: QuerySortOrder, publishAt: Date): Prisma.BlogEntryWhereInput {
    return {
        publishAt:
            order === "asc"
                ? {
                      gt: publishAt,
                  }
                : {
                      lt: publishAt,
                  },
    };
}

function getOrderByDirection(direction: NextBlogEntryDirection): QuerySortOrder {
    return direction === NextBlogEntryDirection.Old ? "desc" : "asc";
}

function isPublished({ publishAt }: BlogEntry): boolean {
    return !!publishAt && publishAt.getTime() < new Date().getTime();
}
