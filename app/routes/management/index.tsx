import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { LinkButton, links as linkButtonLinks } from "../../components/global/button/LinkButton";
import { BlogEntryList, links as blogEntryListLinks } from "../../components/management/blog/BlogEntryList";
import {
    CreateMetaTagButton,
    links as createMetaTagButtonLinks,
} from "../../components/management/metaTag/CreateMetaTagButton";
import {
    links as manageBlogMetaTagListLinks,
    ManagementBlogMetaTagList,
} from "../../components/management/metaTag/ManagementBlogMetaTagList";
import { PathUrl } from "../../constants/paths/PathUrl";
import { findAllBlogMetaTags } from "../../services/blog-meta-tag/blogMetaTag.server";
import { BlogMetaTagClientResponse } from "../../services/blog-meta-tag/types/BlogMetaTagClientResponse";
import { findAllBlogEntries } from "../../services/blog/blogEntry.server";
import { BlogEntryEditItemClientResponse } from "../../services/blog/types/BlogEntryEditItemClientResponse";
import styles from "../../styles/pages/management/management.css";
import { cssLinkDescriptor } from "../../utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => [
    cssLinkDescriptor(styles),
    ...linkButtonLinks(),
    ...blogEntryListLinks(),
    ...manageBlogMetaTagListLinks(),
    ...createMetaTagButtonLinks(),
];

export const loader: LoaderFunction = async () => {
    const entries = await findAllBlogEntries();
    const metaTags = await findAllBlogMetaTags();
    return json([
        entries.map(BlogEntryEditItemClientResponse.fromEntity),
        metaTags.map(BlogMetaTagClientResponse.fromEntity),
    ]);
};

const Admin: FC = () => {
    const [entries, metaTags] = useLoaderData<[BlogEntryEditItemClientResponse[], BlogMetaTagClientResponse[]]>();

    return (
        <main className={`management`}>
            <h1 className={`management__header`}>management menu</h1>
            <section className={`management__section`}>
                <h2 className={`management__section--header`}>blog posts</h2>
                <LinkButton to={PathUrl.management.blog.create()}>CREATE ENTRY</LinkButton>
                <BlogEntryList entries={entries} />
            </section>
            <section className={`management__section`}>
                <h2 className={`management__section--header`}>blog meta tags</h2>
                <CreateMetaTagButton />
                <ManagementBlogMetaTagList blogMetaTags={metaTags} />
            </section>
        </main>
    );
};

export default Admin;
