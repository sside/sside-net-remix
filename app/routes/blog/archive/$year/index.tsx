import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../../../appConfig";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../../../components/blog/blogEntry/BlogEntry";
import { BlogPager, BlogPagerItem, links as blogPagerLinks } from "../../../../components/blog/blogEntry/BlogPager";
import { PathUrl } from "../../../../constants/paths/PathUrl";
import { NotFoundServerError, UnprocessableServerError } from "../../../../error/ServerError";
import { getFullDateTime, parseIso8601ToJst } from "../../../../libraries/datetime";
import { isValidYear } from "../../../../libraries/vallidator/isValidYear";
import { findManyPublishedBlogEntryByYearMonth } from "../../../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { QuerySortOrder } from "../../../../types/database/QuerySortOrder";
import { DateParsedResponseBody } from "../../../../types/utility/DateParsedResponseBody";
import { extractBlogPagingQuery } from "../../../../utilities/blog/blogPagingQuery";
import { sortPublishedBlogEntries } from "../../../../utilities/blog/sortPublishedBlogEntries";

export const links: LinksFunction = () => [...blogEntryLinks(), ...blogPagerLinks()];

export const loader: LoaderFunction = async ({
    params,
    request,
}): Promise<[PrismaPublishedBlogEntry[], PrismaPublishedBlogEntry, PrismaPublishedBlogEntry]> => {
    const { year } = params;

    if (!year || !isValidYear(parseInt(year, 10))) {
        throw new UnprocessableServerError(`パスパラメータ"year"が正しくありません。`, {
            year,
        });
    }

    const parsedYear = parseInt(year);
    const { pointerId, order, count } = extractBlogPagingQuery(request.url) || {};
    const entries = await findManyPublishedBlogEntryByYearMonth(parsedYear, undefined, pointerId, order, count);

    if (!entries.length) {
        throw new NotFoundServerError(`Blog entryが見つかりませんでした。.`, {
            year,
        });
    }

    const { Asc, Desc } = QuerySortOrder;
    const ascSortedEntries = sortPublishedBlogEntries(entries, Asc);
    const [youngerEntries, olderEntries] = await Promise.all([
        findManyPublishedBlogEntryByYearMonth(parsedYear, undefined, ascSortedEntries[0].id, Asc, 2),
        findManyPublishedBlogEntryByYearMonth(
            parsedYear,
            undefined,
            ascSortedEntries[ascSortedEntries.length - 1].id,
            Desc,
            2,
        ),
    ]);

    return [entries, youngerEntries[1], olderEntries[1]];
};

const Year: FC = () => {
    const [entries, younger, older] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaPublishedBlogEntry>[],
                DateParsedResponseBody<PrismaPublishedBlogEntry> | undefined,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | undefined,
            ]
        >();
    const sortedEntries = sortPublishedBlogEntries(entries);

    const createBlogPagerItem = (
        order: QuerySortOrder,
        label: string,
        blogEntry?: DateParsedResponseBody<PrismaPublishedBlogEntry>,
    ): BlogPagerItem | undefined => {
        if (!blogEntry) {
            return undefined;
        }

        const { id, publishAt } = blogEntry;

        return {
            url: PathUrl.blog.archive.byYearPaging(getFullDateTime(parseIso8601ToJst(publishAt!)).year, {
                order,
                count: appConfig.blog.pagingItemCount,
                pointerId: id,
            }),
            label,
        };
    };

    const { Asc, Desc } = QuerySortOrder;

    return (
        <Fragment>
            {sortedEntries.map(blogEntryFromPublishedBlogEntryEntity)}
            <BlogPager
                previous={createBlogPagerItem(Asc, `Previous`, younger)}
                next={createBlogPagerItem(Desc, `Next`, older)}
            />
        </Fragment>
    );
};

export default Year;
