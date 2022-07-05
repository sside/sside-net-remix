import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinkDescriptor } from "../../../utilities/styling/cssLinkDescriptor";
import { links as baseMenuSectionLinks } from "./BaseMenuSection";
import { MenuSectionAboutThisSite } from "./MenuSectionAboutThisSite";
import { MenuSectionArchives, YearMonthFormat, links as menuSectionArchivesLinks } from "./MenuSectionArchives";
import {
    BlogMetaTagCount,
    MenuSectionBlogMetaTags,
    links as menuSectionBlogMetaTagsLinks,
} from "./MenuSectionBlogMetaTags";
import { links as menuSectionOnlineActivitiesLinks, MenuSectionOnlineActivities } from "./MenuSectionOnlineActivities";
import { MenuSectionRecentBlogEntries, RecentBlogEntryItem } from "./MenuSectionRecentBlogEntries";
import styles from "./TheMenu.css";

export const links: LinksFunction = () => [
    cssLinkDescriptor(styles),
    ...baseMenuSectionLinks(),
    ...menuSectionOnlineActivitiesLinks(),
    ...menuSectionArchivesLinks(),
    ...menuSectionBlogMetaTagsLinks(),
];

interface Props {
    recentEntries: RecentBlogEntryItem[];
    archivePublishedYearMonths: YearMonthFormat[];
    blogMetaTagCounts: BlogMetaTagCount[];
}

export const TheMenu: FC<Props> = ({ recentEntries, archivePublishedYearMonths, blogMetaTagCounts }) => {
    return (
        <aside className={`theMenu`}>
            <MenuSectionAboutThisSite />
            <MenuSectionOnlineActivities />
            <MenuSectionRecentBlogEntries recentEntries={recentEntries} />
            <MenuSectionArchives yearMonths={archivePublishedYearMonths} />
            <MenuSectionBlogMetaTags blogMetaTagCounts={blogMetaTagCounts} />
        </aside>
    );
};
