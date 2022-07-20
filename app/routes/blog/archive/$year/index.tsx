import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../../../components/blog/blogEntry/BlogEntry";
import { NotFoundServerError, UnprocessableServerError } from "../../../../error/ServerError";
import { isValidYear } from "../../../../libraries/vallidator/isValidYear";
import { findManyPublishedBlogEntryByYearMonth } from "../../../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../../../types/utility/DateParsedResponseBody";
import { extractBlogPagingQuery } from "../../../../utilities/blog/blogPagingQuery";
import { sortPublishedBlogEntries } from "../../../../utilities/blog/sortPublishedBlogEntries";

export const links: LinksFunction = () => [...blogEntryLinks()];

export const loader: LoaderFunction = async ({ params, request }): Promise<PrismaPublishedBlogEntry[]> => {
    const { year } = params;

    if (!year || !isValidYear(parseInt(year, 10))) {
        throw new UnprocessableServerError(`Year path is not valid.`, {
            year,
        });
    }

    const pagingQuery = extractBlogPagingQuery(request.url);
    const entries = await findManyPublishedBlogEntryByYearMonth(
        parseInt(year),
        undefined,
        pagingQuery?.pointerId,
        pagingQuery?.order,
        pagingQuery?.count,
    );

    if (!entries.length) {
        throw new NotFoundServerError(`By year, blog entries not found.`, {
            year,
        });
    }

    return entries;
};

export const Year: FC = () => {
    const entries = useLoaderData<DateParsedResponseBody<PrismaPublishedBlogEntry>[]>();

    return <Fragment>{sortPublishedBlogEntries(entries).map(blogEntryFromPublishedBlogEntryEntity)}</Fragment>;
};

export default Year;
