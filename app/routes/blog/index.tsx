import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../../appConfig";
import { BlogEntry, BlogEntryItem } from "../../components/blog/blogEntry/BlogEntry";
import { parseIso8601ToJst } from "../../libraries/datetime";
import { findManyBlogEntryRecentPublished } from "../../services/blog/blogEntry.server";
import { PrismaPublishedBlogEntry } from "../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../types/DateParsedResponseBody";
import { getLatestBlogEntryBody } from "../../utilities/blog/getLatestBlogEntryBody";

export const loader: LoaderFunction = async (): Promise<PrismaPublishedBlogEntry[]> => {
    return await findManyBlogEntryRecentPublished(appConfig.blog.indexEntriesCount);
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
