import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { BlogEntry } from "../../../components/blog/blogEntry/BlogEntry";
import { parseIso8601ToJst } from "../../../libraries/datetime";
import { getAllMetaTagNamesFromMetaTags } from "../../../services/blog-meta-tag/blogMetaTag.server";
import { findOnePublishedBlogEntryBySlug } from "../../../services/blog/blogEntry.server";
import { PrismaJoinedBlogEntry } from "../../../services/blog/types/prisma/PrismaJoinedBlogEntry";
import { DateParsedResponseBody } from "../../../types/DateParsedResponseBody";
import { getLatestBlogEntryBody } from "../../../utilities/blog/getLatestBlogEntryBody";

export const loader: LoaderFunction = async ({ params }): Promise<PrismaJoinedBlogEntry> => {
    return await findOnePublishedBlogEntryBySlug(params.slug!);
};

const BlogSlugRoute: FC = () => {
    const { slug, publishAt, blogMetaTags, blogEntryBodyHistories } =
        useLoaderData<DateParsedResponseBody<PrismaJoinedBlogEntry>>();
    const { title, body, updatedAt } = getLatestBlogEntryBody(blogEntryBodyHistories);

    return (
        <BlogEntry
            title={title}
            slug={slug}
            bodyMarkdown={body}
            publishAt={parseIso8601ToJst(publishAt!)}
            updatedAt={parseIso8601ToJst(updatedAt)}
            metaTags={getAllMetaTagNamesFromMetaTags(blogMetaTags)}
        />
    );
};

export default BlogSlugRoute;
