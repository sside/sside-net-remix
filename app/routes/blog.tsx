import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import { appConfig } from "../../appConfig";
import { TheFooter, links as theFooterLinks } from "../components/publicLayout/footer/TheFooter";
import { links as theHeaderLink, TheHeader } from "../components/publicLayout/header/TheHeader";
import { YearMonthFormat } from "../components/publicLayout/menu/MenuSectionArchives";
import { BlogMetaTagCount } from "../components/publicLayout/menu/MenuSectionBlogMetaTags";
import { RecentBlogEntryItem } from "../components/publicLayout/menu/MenuSectionRecentBlogEntries";
import { links as theMenuLinks, TheMenu } from "../components/publicLayout/menu/TheMenu";
import { DateFormat, formatDate, parseIso8601ToJst } from "../libraries/datetime";
import { findAllBlogMetaTagCounts } from "../services/blog-meta-tag/blogMetaTag.server";
import { findAllBlogEntryOnlyPublishAt, findManyBlogEntryRecentPublished } from "../services/blog/blogEntry.server";
import styles from "../styles/pages/blog/blogOutlet.css";
import { DateParsedResponseBody } from "../types/DateParsedResponseBody";
import { convertDateToString } from "../utilities/converter/convertDateToString";
import { cssLinkDescriptor } from "../utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => [
    cssLinkDescriptor(styles),
    ...theHeaderLink(),
    ...theMenuLinks(),
    ...theFooterLinks(),
];

export const loader: LoaderFunction = async (): Promise<
    [DateParsedResponseBody<RecentBlogEntryItem>[], string[], BlogMetaTagCount[]]
> => {
    const recentEntries = await findManyBlogEntryRecentPublished(appConfig.menu.latestEntries.entriesCount);
    const recentEntriesResponse = recentEntries.map(RecentBlogEntryItem.fromEntity).map(convertDateToString);

    const archivesPublishYearMonths = Array.from(
        new Set(
            (await findAllBlogEntryOnlyPublishAt()).map((publishAt) => formatDate(publishAt, DateFormat.YearMonth)),
        ),
    );

    const metaTags: BlogMetaTagCount[] = (await findAllBlogMetaTagCounts()).map(({ name, _count }) => ({
        name,
        count: _count.blogEntries,
    }));

    return [recentEntriesResponse, archivesPublishYearMonths, metaTags];
};

const Blog: FC = () => {
    const [recentEntriesResponse, archivePublishedYearMonths, blogMetaTagCounts] =
        useLoaderData<[DateParsedResponseBody<RecentBlogEntryItem>[], YearMonthFormat[], BlogMetaTagCount[]]>();
    const recentEntries: RecentBlogEntryItem[] = recentEntriesResponse.map(({ updatedAt, publishAt, ...rest }) => ({
        ...rest,
        updatedAt: parseIso8601ToJst(updatedAt),
        publishAt: parseIso8601ToJst(publishAt),
    }));

    return (
        <Fragment>
            <TheHeader />
            <TheMenu
                recentEntries={recentEntries}
                archivePublishedYearMonths={archivePublishedYearMonths}
                blogMetaTagCounts={blogMetaTagCounts}
            />
            <main className={`blog`}>
                <Outlet />
            </main>
            <TheFooter />
        </Fragment>
    );
};

export default Blog;
