import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinkDescriptor } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogEntry.css";
import { BlogEntryBody, links as blogEntryBodyLinks } from "./BlogEntryBody";
import { BlogEntryFooter } from "./BlogEntryFooter";
import { BlogEntryHeader } from "./BlogEntryHeader";

export const link: LinksFunction = () => [cssLinkDescriptor(styles), ...blogEntryBodyLinks()];

export interface BlogEntryItem {
    id: string;
    title: string;
    bodyMarkdown: string;
    publishAt: Date;
    updatedAt: Date;
    metaTags: string[];
}

export const BlogEntry: FC<BlogEntryItem> = ({ title, bodyMarkdown, metaTags, publishAt, updatedAt }) => {
    return (
        <article>
            <BlogEntryHeader title={title} />
            <BlogEntryBody bodyMarkdown={bodyMarkdown} />
            <BlogEntryFooter metaTags={metaTags} />
        </article>
    );
};
