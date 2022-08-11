import { BlogEntry, Prisma } from "@prisma/client";
import { appConfig } from "../../../appConfig";
import { NotFoundServerError, UnprocessableServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { createMonthRange, createYearRange } from "../../libraries/datetime";
import { Logger } from "../../libraries/logger/logger";
import { isValidMonth } from "../../libraries/vallidator/isValidMonth";
import { isValidYear } from "../../libraries/vallidator/isValidYear";
import { QuerySortOrder } from "../../types/database/QuerySortOrder";
import { NextBlogEntryDirection } from "./constants/NextBlogEntryDirection";
import { PrismaPublishedBlogEntry } from "./types/prisma/PrismaPublishedBlogEntry";

const logger = new Logger("findPublishedBlogEntry");

export async function findOnePublishedBlogEntryById(id: string): Promise<PrismaPublishedBlogEntry> {
    logger.log(`公開済みBlog entryをidで検索します。`, {
        id,
    });

    const blogEntry = await findUnique({
        id,
    });

    if (!blogEntry || !isPublished(blogEntry)) {
        throw new NotFoundServerError(`Blog entryが見つかりませんでした。`, {
            id,
        });
    }

    return blogEntry;
}

export async function findOnePublishedBlogEntryBySlug(slug: string): Promise<PrismaPublishedBlogEntry> {
    logger.log(`公開済みBlog entryをslugで検索します。`, {
        slug,
    });

    const blogEntry = await findUnique({
        slug,
    });

    if (!blogEntry || !isPublished(blogEntry)) {
        throw new NotFoundServerError(`Blog entryが見つかりませんでした。`, {
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
    logger.log(`同じmeta tagで公開日の隣接する公開済みBlog entryを検索します。`, {
        metaTagName,
        blogEntryId,
        direction,
    });
    const { publishAt: existPublishAt } = await findOnePublishedBlogEntryById(blogEntryId);

    const order = getOrderByDirection(direction);
    const nextBlogEntry = await findFirst({
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
    });

    if (!nextBlogEntry) {
        throw new NotFoundServerError(`同じBlog meta tagで次のentryが見つかりませんでした。`, {
            blogEntryId,
            direction,
        });
    }

    return nextBlogEntry;
}

export async function findBothSidePublishedBlogEntry(
    pointerId: string,
): Promise<[PrismaPublishedBlogEntry | null, PrismaPublishedBlogEntry | null]> {
    logger.log(`前後の公開日を持つ公開済みBlog entryを検索します。`);
    const { Old, Young } = NextBlogEntryDirection;

    const [old, young] = (
        await Promise.allSettled([
            findOnePublishedBlogEntryNext(pointerId, Old),
            findOnePublishedBlogEntryNext(pointerId, Young),
        ])
    ).map((result) => (result.status === "fulfilled" ? result.value : null));

    return [old, young];
}

export async function findManyPublishedBlogEntryRecent(
    count = appConfig.blog.indexEntriesCount,
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`直近で公開された公開済みBlog entryを検索します。`, {
        count,
    });

    return await findMany({
        where: createWhereQueryOnlyPublished(),
        orderBy: {
            publishAt: "desc",
        },
        take: count,
    });
}

export async function findManyPublishedBlogEntryByPaging(
    pointerId: string,
    order: QuerySortOrder,
    count = appConfig.blog.pagingItemCount,
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`ページングした公開済みBlog entryを検索します。`, {
        pointerId,
        order,
        limit: count,
    });

    const { publishAt } = await findOnePublishedBlogEntryById(pointerId);

    return await findMany({
        where: { ...createWhereQueryOnlyPublished(), ...createWhereQueryPublishAtThreshold(order, publishAt!) },
        orderBy: {
            publishAt: order,
        },
        take: count,
    });
}

export async function findManyPublishedBlogEntryByMetaTagName(
    metaTagName: string,
    pointerId?: string,
    order: QuerySortOrder = "desc",
    limit = appConfig.blog.pagingItemCount,
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`Meta tagの名称で公開済みBlog entryを検索します。`, {
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

    return await findMany({
        where: {
            AND: blogEntryWhere,
            blogMetaTags: {
                some: {
                    name: metaTagName,
                },
            },
        },
        orderBy: {
            publishAt: order,
        },
        take: limit,
    });
}

export async function findManyPublishedBlogEntryByYearMonth(
    year: number,
    month?: number,
    pointerId?: string,
    order: QuerySortOrder = "desc",
    count = appConfig.blog.pagingItemCount,
): Promise<PrismaPublishedBlogEntry[]> {
    logger.log(`年度、または年月で公開済みBlog entryを検索します。`, {
        year,
        month,
        pointerId,
        order,
        count,
    });

    const where = createWhereQueryOnlyPublished();
    const dateWhereAnd: Prisma.BlogEntryWhereInput[] = [];
    const [queryStart, queryEnd] = createYearOrYearMonthRange(year, month);
    dateWhereAnd.push({
        publishAt: {
            gte: queryStart,
            lte: queryEnd,
        },
    });

    if (pointerId && order) {
        const { publishAt } = await findOnePublishedBlogEntryById(pointerId);
        dateWhereAnd.push(createWhereQueryPublishAtThreshold(order, publishAt!));
    }

    return await findMany({
        where: {
            ...where,
            AND: dateWhereAnd,
        },
        orderBy: {
            publishAt: order,
        },
        take: count,
    });
}

export async function findAllBlogEntryOnlyPublishAt(): Promise<Date[]> {
    logger.log(`全ての公開済みBlog entryを取得します。`);

    return (
        await prisma.blogEntry.findMany({
            where: createWhereQueryOnlyPublished(),
            select: {
                publishAt: true,
            },
        })
    ).map(({ publishAt }) => publishAt!);
}

async function findUnique(where: Prisma.BlogEntryWhereUniqueInput): Promise<PrismaPublishedBlogEntry | null> {
    return await prisma.blogEntry.findUnique({
        where,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
    });
}

async function findFirst(args?: Prisma.BlogEntryFindFirstArgs): Promise<PrismaPublishedBlogEntry | null> {
    return await prisma.blogEntry.findFirst({
        ...args,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
    });
}

async function findMany(args?: Prisma.BlogEntryFindManyArgs): Promise<PrismaPublishedBlogEntry[]> {
    return await prisma.blogEntry.findMany({
        ...args,
        include: {
            blogEntryBodyHistories: true,
            blogMetaTags: true,
        },
    });
}

async function findOnePublishedBlogEntryNext(
    pointerId: string,
    direction: NextBlogEntryDirection,
): Promise<PrismaPublishedBlogEntry> {
    logger.log(`公開日が隣接した公開済みBlog entryを検索します。`, {
        pointerId,
        direction,
    });

    const { publishAt } = await findOnePublishedBlogEntryById(pointerId);

    const order = getOrderByDirection(direction);
    const next = await findFirst({
        where: {
            ...createWhereQueryPublishAtThreshold(order, publishAt!),
        },
        orderBy: {
            publishAt: order,
        },
    });

    if (!next) {
        throw new NotFoundServerError(`次のBlog entryが見つかりませんでした。`, {
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

function createYearOrYearMonthRange(year: number, month?: number): [Date, Date] {
    if (!isValidYear(year)) {
        throw new UnprocessableServerError(`年の値が正しくありません。`, {
            year,
        });
    }
    if (month && !isValidMonth(month)) {
        throw new UnprocessableServerError(`月の値が正しくありません。`, {
            month,
        });
    }

    return month ? createMonthRange(year, month) : createYearRange(year);
}

function getOrderByDirection(direction: NextBlogEntryDirection): QuerySortOrder {
    return direction === NextBlogEntryDirection.Old ? "desc" : "asc";
}

function isPublished({ publishAt }: BlogEntry): boolean {
    return !!publishAt && publishAt.getTime() < new Date().getTime();
}
