import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../appConfig";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../components/blog/blogEntry/BlogEntry";
import { BlogPager, BlogPagerItem, links as blogPagerLinks } from "../../components/blog/blogEntry/BlogPager";
import { PathUrl } from "../../constants/paths/PathUrl";
import { NotFoundServerError } from "../../error/ServerError";
import {
    findManyPublishedBlogEntryByPaging,
    findManyPublishedBlogEntryRecent,
} from "../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { QuerySortOrder } from "../../types/database/QuerySortOrder";
import { DateParsedResponseBody } from "../../types/utility/DateParsedResponseBody";
import { extractBlogPagingQuery } from "../../utilities/blog/blogPagingQuery";
import { sortPublishedBlogEntries } from "../../utilities/blog/sortPublishedBlogEntries";

export const links: LinksFunction = () => [...blogEntryLinks(), ...blogPagerLinks()];

export const loader: LoaderFunction = async ({
    request,
}): Promise<
    [PrismaPublishedBlogEntry[], PrismaPublishedBlogEntry | undefined, PrismaPublishedBlogEntry | undefined]
> => {
    let blogEntries: PrismaPublishedBlogEntry[];
    const pagingQuery = extractBlogPagingQuery(request.url);
    if (pagingQuery) {
        const { pointerId, order, count } = pagingQuery;
        blogEntries = await findManyPublishedBlogEntryByPaging(pointerId, order, count);
    } else {
        blogEntries = await findManyPublishedBlogEntryRecent(appConfig.blog.pagingItemCount);
    }

    if (!blogEntries.length) {
        throw new NotFoundServerError(`Blog entries not found.`, {
            ...pagingQuery,
        });
    }

    const { Asc, Desc } = QuerySortOrder;
    const sortedEntries = sortPublishedBlogEntries(blogEntries, Asc);
    const older = (await findManyPublishedBlogEntryByPaging(sortedEntries[0].id, Desc, 1))[0];
    const younger = (await findManyPublishedBlogEntryByPaging(sortedEntries[sortedEntries.length - 1].id, Asc, 1))[0];

    return [blogEntries, older, younger];
};

const BlogIndex: FC = () => {
    const [fetchedBlogEntries, older, younger] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaPublishedBlogEntry>[],
                DateParsedResponseBody<PrismaPublishedBlogEntry | undefined>,
                DateParsedResponseBody<PrismaPublishedBlogEntry | undefined>,
            ]
        >();

    const { Asc, Desc } = QuerySortOrder;

    const createPagerItem = (
        pointerBlogEntry: DateParsedResponseBody<PrismaPublishedBlogEntry> | undefined,
        order: QuerySortOrder,
    ): BlogPagerItem | undefined => {
        if (!pointerBlogEntry) {
            return undefined;
        }

        return {
            url: PathUrl.blog.rootPaging({
                pointerId: pointerBlogEntry.id,
                count: appConfig.blog.pagingItemCount,
                order,
            }),
            label: order === Desc ? `Next` : `Previous`,
        };
    };

    return (
        <Fragment>
            {sortPublishedBlogEntries(fetchedBlogEntries).map((entry) => blogEntryFromPublishedBlogEntryEntity(entry))}
            <BlogPager previous={createPagerItem(younger, Asc)} next={createPagerItem(older, Desc)} />
        </Fragment>
    );
};

export default BlogIndex;
