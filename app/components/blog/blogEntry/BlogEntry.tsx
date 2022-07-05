import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
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
