import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { parseIso8601ToJst } from "../../../libraries/datetime";
import { PrismaPublishedBlogEntry } from "../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../../types/utility/DateParsedResponseBody";
import { getLatestBlogEntryBody } from "../../../utilities/blog/getLatestBlogEntryBody";
import { cssLinkDescriptor } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogEntry.css";
import { BlogEntryBody, links as blogEntryBodyLinks } from "./BlogEntryBody";
import { BlogEntryFooter } from "./BlogEntryFooter";
import { BlogEntryHeader, links as blogEntryHeaderLinks } from "./BlogEntryHeader";

export const link: LinksFunction = () => [
    cssLinkDescriptor(styles),
    ...blogEntryBodyLinks(),
    ...blogEntryHeaderLinks(),
];

export interface BlogEntryItem {
    title: string;
    slug: string;
    bodyMarkdown: string;
    publishAt: Date;
    updatedAt: Date;
    metaTags: string[];
}

export const BlogEntry: FC<BlogEntryItem> = ({ title, slug, bodyMarkdown, metaTags, publishAt, updatedAt }) => {
    return (
        <article className={`blogEntry`}>
            <BlogEntryHeader title={title} slug={slug} publishAt={publishAt} updatedAt={updatedAt} />
            <BlogEntryBody bodyMarkdown={bodyMarkdown} />
            <BlogEntryFooter metaTags={metaTags} />
        </article>
    );
};

export const blogEntryFromPublishedBlogEntryEntity = (
    publishedBlogEntry: DateParsedResponseBody<PrismaPublishedBlogEntry>,
) => {
    const { id, slug, blogEntryBodyHistories, blogMetaTags, publishAt } = publishedBlogEntry;
    const { title, updatedAt, body } = getLatestBlogEntryBody(blogEntryBodyHistories);

    return (
        <BlogEntry
            key={id}
            title={title}
            slug={slug}
            bodyMarkdown={body}
            publishAt={parseIso8601ToJst(publishAt!)}
            updatedAt={parseIso8601ToJst(updatedAt)}
            metaTags={blogMetaTags.map(({ name }) => name)}
        />
    );
};
