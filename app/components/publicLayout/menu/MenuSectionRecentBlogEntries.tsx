import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { toIso8601Date } from "../../../libraries/datetime";
import { PrismaPublishedBlogEntry } from "../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { isUpdatedEntry } from "../../../utilities/blog/isUpdatedBlogEntry";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import { BaseMenuSection } from "./BaseMenuSection";
import styles from "./MenuSectionRecentBlogEntries.css";

export const links: LinksFunction = () => cssLinks(styles);

export class RecentBlogEntryItem {
    constructor(
        readonly blogEntryId: string,
        readonly slug: string,
        readonly title: string,
        readonly publishAt: Date,
        readonly updatedAt: Date,
    ) {}

    static fromEntity({ id, slug, publishAt, blogEntryBodyHistories }: PrismaPublishedBlogEntry): RecentBlogEntryItem {
        const { updatedAt, title } = blogEntryBodyHistories.reduce(
            (previousValue, currentValue) =>
                previousValue.updatedAt.getTime() > currentValue.updatedAt.getTime() ? previousValue : currentValue,
            blogEntryBodyHistories[0],
        );
        return {
            blogEntryId: id,
            title,
            slug,
            publishAt: publishAt!,
            updatedAt,
        };
    }
}

interface Props {
    recentEntries: RecentBlogEntryItem[];
}

export const MenuSectionRecentBlogEntries: FC<Props> = ({ recentEntries }) => {
    const createTitle = (title: string, publishAt: Date, updatedAt: Date): string => {
        let created = title + ` (${toIso8601Date(publishAt)}`;
        if (isUpdatedEntry(publishAt, updatedAt, 60)) {
            created += ` update: ${toIso8601Date(updatedAt)}`;
        }
        created += ")";
        return created;
    };

    return (
        <BaseMenuSection sectionName={`Recent entries`}>
            <ul className={`menuSectionRecentBlogEntries`}>
                {recentEntries.map(({ blogEntryId, title, slug, publishAt, updatedAt }) => (
                    <li className={`menuSectionRecentBlogEntries__item`} key={blogEntryId}>
                        <Link to={PathUrl.blog.entryBySlug(slug)}>{createTitle(title, publishAt, updatedAt)}</Link>
                    </li>
                ))}
            </ul>
        </BaseMenuSection>
    );
};
