import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../../../appConfig";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../../../components/blog/blogEntry/BlogEntry";
import { BlogPager, BlogPagerItem } from "../../../../components/blog/blogEntry/BlogPager";
import { PathUrl } from "../../../../constants/paths/PathUrl";
import { NotFoundServerError, toErrorResponse } from "../../../../error/ServerError";
import { NextBlogEntryDirection } from "../../../../services/blog/constants/NextBlogEntryDirection";
import {
    findManyPublishedBlogEntryByMetaTagName,
    findOnePublishedBlogEntryNextSameMetaTagByAndId,
} from "../../../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../../../types/utility/DateParsedResponseBody";
import { QuerySortOrder } from "../../../../types/database/QuerySortOrder";
import { sortPublishedBlogEntries } from "../../../../utilities/blog/sortPublishedBlogEntries";

export const links: LinksFunction = () => blogEntryLinks();

export const loader: LoaderFunction = async ({
    params,
    request,
}): Promise<[PrismaPublishedBlogEntry[], PrismaPublishedBlogEntry | null, PrismaPublishedBlogEntry | null]> => {
    const { metaTagName } = params;
    if (!metaTagName) {
        throw toErrorResponse(new NotFoundServerError(`Blog meta tag id is not defined. Meta tag name:${metaTagName}`));
    }
    const queries = new URL(request.url).searchParams;
    const pointerId = queries.get("pointerId");
    const order = queries.get("order");
    const count = queries.get("count");

    const entries = await findManyPublishedBlogEntryByMetaTagName(
        metaTagName,
        pointerId || undefined,
        (order as QuerySortOrder) || undefined,
        parseInt(count!) || appConfig.blog.pagingItemCount,
    );

    if (!entries || !entries.length) {
        throw new NotFoundServerError(
            `Blog entries not found by meta tag. Meta tag name: ${metaTagName}, pointerId: ${pointerId}, order: ${order}, count: ${count}`,
        );
    }

    const sorted = sortPublishedBlogEntries(entries, "asc");
    const { Old, Young } = NextBlogEntryDirection;
    const [old, young] = (
        await Promise.allSettled([
            findOnePublishedBlogEntryNextSameMetaTagByAndId(metaTagName, sorted[0].id, Old),
            findOnePublishedBlogEntryNextSameMetaTagByAndId(metaTagName, sorted[sorted.length - 1].id, Young),
        ])
    ).map((result) => (result.status === "fulfilled" ? result.value : null));

    return [entries, old, young];
};

export const MetaTagId: FC = () => {
    const [blogEntries, oldBlogEntry, youngBlogEntry] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaPublishedBlogEntry>[],
                DateParsedResponseBody<PrismaPublishedBlogEntry> | null,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | null,
            ]
        >();
    const { metaTagName } = useParams();

    const ascSortedEntries = sortPublishedBlogEntries(blogEntries, "asc");
    const { pagingItemCount } = appConfig.blog;
    const next: BlogPagerItem | undefined = oldBlogEntry
        ? {
              url: PathUrl.blog.metaTag.byMetaTagWithPaging(metaTagName!, {
                  pointerId: ascSortedEntries[0].id,
                  order: "desc",
                  count: pagingItemCount,
              }),
              label: "next entries",
          }
        : undefined;
    const previous: BlogPagerItem | undefined = youngBlogEntry
        ? {
              url: PathUrl.blog.metaTag.byMetaTagWithPaging(metaTagName!, {
                  pointerId: ascSortedEntries[ascSortedEntries.length - 1].id,
                  order: "asc",
                  count: pagingItemCount,
              }),
              label: "previous entries",
          }
        : undefined;

    return (
        <Fragment>
            {sortPublishedBlogEntries(blogEntries).map((blogEntry) => blogEntryFromPublishedBlogEntryEntity(blogEntry))}
            <BlogPager next={next} previous={previous} />
        </Fragment>
    );
};

export default MetaTagId;
