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

const publishedBlogEntryWhereQuery: Prisma.BlogEntryWhereInput = {
    publishAt: {
        lte: new Date(),
    },
};

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
    logger.log(`Find `);

    const { publishAt: existPublishAt } = await findOnePublishedBlogEntryById(blogEntryId);
    const isOldDirection = direction === NextBlogEntryDirection.Old;

    const nextBlogEntry = await prisma.blogEntry.findFirst({
        where: {
            publishAt: isOldDirection
                ? {
                      lt: existPublishAt!,
                  }
                : {
                      gt: existPublishAt!,
                  },
            blogMetaTags: {
                some: {
                    name: metaTagName,
                },
            },
        },
        orderBy: {
            publishAt: isOldDirection ? "asc" : "desc",
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
        where: publishedBlogEntryWhereQuery,
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

    const pointerRecord = await findOnePublishedBlogEntryById(pointerId);
    const whereQuery = { ...publishedBlogEntryWhereQuery };
    whereQuery.AND = [
        order === "asc"
            ? { publishAt: { gte: pointerRecord.publishAt! } }
            : { publishAt: { lte: pointerRecord.publishAt! } },
    ];

    if (year) {
        let queryStart: Date, queryEnd: Date;
        if (month) {
            const [monthStart, monthEnd] = createMonthRange(year, month);
            queryStart = monthStart;
            queryEnd = monthEnd;
        } else {
            const [yearStart, yearEnd] = createYearRange(year);
            queryStart = yearStart;
            queryEnd = yearEnd;
        }
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

    const blogEntryWhere: Prisma.BlogEntryWhereInput[] = [{ ...publishedBlogEntryWhereQuery }];

    if (pointerId) {
        const { publishAt } = await findOnePublishedBlogEntryById(pointerId);
        blogEntryWhere.push({
            publishAt:
                order === "desc"
                    ? {
                          lt: publishAt!,
                      }
                    : {
                          gt: publishAt!,
                      },
        });
    }

    return await prisma.blogEntry.findMany({
        where: {
            AND: [...blogEntryWhere],
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
            where: publishedBlogEntryWhereQuery,
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
        pointerDate: pointerId,
    });

    const { publishAt } = await findOnePublishedBlogEntryById(pointerId);
    const isOlder = direction === NextBlogEntryDirection.Old;

    const next = await prisma.blogEntry.findFirst({
        where: {
            publishAt: isOlder
                ? {
                      lt: publishAt!,
                  }
                : {
                      gt: publishAt!,
                  },
        },
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
        orderBy: {
            publishAt: isOlder ? "desc" : "asc",
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

function isPublished({ publishAt }: BlogEntry): boolean {
    return !!publishAt && publishAt.getTime() < new Date().getTime();
}
