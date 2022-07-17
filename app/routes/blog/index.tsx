import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../appConfig";
import { BlogEntry, BlogEntryItem, link as blogEntryLinks } from "../../components/blog/blogEntry/BlogEntry";
import { parseIso8601ToJst } from "../../libraries/datetime";
import { createPagingQuery } from "../../libraries/vallidator/validatePagingQuery";
import {
    findManyPublishedBlogEntryByPaging,
    findManyPublishedBlogEntryRecent,
} from "../../services/blog/findPublishedBlogEntry.server";
import { PrismaPublishedBlogEntry } from "../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../types/DateParsedResponseBody";
import { getLatestBlogEntryBody } from "../../utilities/blog/getLatestBlogEntryBody";

export const links: LinksFunction = () => [...blogEntryLinks()];

export const loader: LoaderFunction = async ({ params }): Promise<PrismaPublishedBlogEntry[]> => {
    const { pointer, order, count } = params;
    const { pagingItemCount } = appConfig.blog;

    let blogEntries: PrismaPublishedBlogEntry[];
    if (pointer && order && count) {
        const { pointer: queryPointerId, order: queryOrder } = createPagingQuery(pointer, order);
        blogEntries = await findManyPublishedBlogEntryByPaging(queryPointerId, queryOrder, pagingItemCount);
    } else {
        blogEntries = await findManyPublishedBlogEntryRecent(pagingItemCount);
    }

    return blogEntries;
};

const BlogIndex: FC = () => {
    const fetchedBlogEntries = useLoaderData<DateParsedResponseBody<PrismaPublishedBlogEntry>[]>();
    const blogEntries: (BlogEntryItem & Pick<PrismaPublishedBlogEntry, "id">)[] = fetchedBlogEntries.map(
        ({ id, slug, blogEntryBodyHistories, blogMetaTags, publishAt }) => {
            const { title, body, updatedAt } = getLatestBlogEntryBody(blogEntryBodyHistories);
            const metaTags: string[] = blogMetaTags.map(({ name }) => name);
            return {
                id,
                title,
                slug,
                bodyMarkdown: body,
                metaTags,
                publishAt: parseIso8601ToJst(publishAt!),
                updatedAt: parseIso8601ToJst(updatedAt),
            };
        },
    );

    return (
        <Fragment>
            {blogEntries.map(({ id, title, slug, bodyMarkdown, publishAt, updatedAt, metaTags }) => (
                <BlogEntry
                    key={id}
                    title={title}
                    slug={slug}
                    bodyMarkdown={bodyMarkdown}
                    publishAt={publishAt}
                    updatedAt={updatedAt}
                    metaTags={metaTags}
                />
            ))}
        </Fragment>
    );
};

export default BlogIndex;
