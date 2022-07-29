import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../../../../appConfig";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../../../../components/blog/blogEntry/BlogEntry";
import { BlogPager, BlogPagerItem, links as blogPagerLinks } from "../../../../../components/blog/blogEntry/BlogPager";
import { PathUrl } from "../../../../../constants/paths/PathUrl";
import { BadRequestServerError, NotFoundServerError, UnprocessableServerError } from "../../../../../error/ServerError";
import { getFullDateTime, parseIso8601ToJst } from "../../../../../libraries/datetime";
import { isValidMonth } from "../../../../../libraries/vallidator/isValidMonth";
import { isValidYear } from "../../../../../libraries/vallidator/isValidYear";
import { findManyPublishedBlogEntryByYearMonth } from "../../../../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { QuerySortOrder } from "../../../../../types/database/QuerySortOrder";
import { DateParsedResponseBody } from "../../../../../types/utility/DateParsedResponseBody";
import { extractBlogPagingQuery } from "../../../../../utilities/blog/blogPagingQuery";
import { sortPublishedBlogEntries } from "../../../../../utilities/blog/sortPublishedBlogEntries";

export const links: LinksFunction = () => [...blogEntryLinks(), ...blogPagerLinks()];

export const loader: LoaderFunction = async ({
    params,
    request,
}): Promise<
    [PrismaPublishedBlogEntry[], PrismaPublishedBlogEntry | undefined, PrismaPublishedBlogEntry | undefined]
> => {
    const { year, month } = params;
    if (!year || !month) {
        throw new UnprocessableServerError(`year or month path parameter is not defined.`, {
            year,
            month,
        });
    }

    const [parsedYear, parsedMonth] = [year, month].map((value) => parseInt(value, 10));

    if (!(isValidYear(parsedYear) && isValidMonth(parsedMonth))) {
        throw new BadRequestServerError(`year or month path parameter is not valid.`, {
            parsedYear,
            parsedMonth,
        });
    }

    const pagingQuery = extractBlogPagingQuery(request.url);
    const { pointerId, count, order } = pagingQuery || {};

    const entries = await findManyPublishedBlogEntryByYearMonth(parsedYear, parsedMonth, pointerId, order, count);
    if (!entries.length) {
        throw new NotFoundServerError(`Blog entries not found.`, {
            year,
            month,
            pointerId,
            count,
            order,
        });
    }

    const { Asc, Desc } = QuerySortOrder;
    const sortedEntries = sortPublishedBlogEntries(entries, Asc);
    const [youngerEntries, olderEntries] = await Promise.all([
        findManyPublishedBlogEntryByYearMonth(parsedYear, parsedMonth, sortedEntries[0].id, Asc, 2),
        findManyPublishedBlogEntryByYearMonth(
            parsedYear,
            parsedMonth,
            sortedEntries[sortedEntries.length - 1].id,
            Desc,
            2,
        ),
    ]);

    return [entries, youngerEntries[1], olderEntries[1]];
};

const Month: FC = () => {
    const [entries, younger, older] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaPublishedBlogEntry>[],
                DateParsedResponseBody<PrismaPublishedBlogEntry>,
                DateParsedResponseBody<PrismaPublishedBlogEntry>,
            ]
        >();

    const { Asc, Desc } = QuerySortOrder;

    const createBlogPagerItem = (
        order: QuerySortOrder,
        blogEntry?: DateParsedResponseBody<PrismaPublishedBlogEntry>,
    ): BlogPagerItem | undefined => {
        if (!blogEntry) {
            return undefined;
        }

        const { publishAt, id } = blogEntry;
        const { year, month } = getFullDateTime(parseIso8601ToJst(publishAt!));
        return {
            url: PathUrl.blog.archive.byYearMonthPaging(year, month, {
                count: appConfig.blog.pagingItemCount,
                order,
                pointerId: id,
            }),
            label: order === Asc ? `previous` : `next`,
        };
    };

    return (
        <Fragment>
            {sortPublishedBlogEntries(entries).map(blogEntryFromPublishedBlogEntryEntity)}
            <BlogPager next={createBlogPagerItem(Desc, older)} previous={createBlogPagerItem(Asc, younger)} />{" "}
        </Fragment>
    );
};

export default Month;
