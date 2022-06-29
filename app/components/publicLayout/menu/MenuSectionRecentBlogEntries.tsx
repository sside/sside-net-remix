import { Link } from "@remix-run/react";
import { DurationLikeObject } from "luxon";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { isBetweenDate, minusDate, plusDate, toIso8601Date } from "../../../libraries/datetime";
import { PrismaPublishedBlogEntry } from "../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { BaseMenuSection } from "./BaseMenuSection";

export class RecentBlogEntryItem {
    constructor(
        readonly blogEntryId: string,
        readonly slug: string,
        readonly title: string,
        readonly publishAt: Date,
        readonly updatedAt: Date,
    ) {}

    static fromEntity({ id, slug, publishAt, blogEntryBodies }: PrismaPublishedBlogEntry): RecentBlogEntryItem {
        const { updatedAt, title } = blogEntryBodies.reduce(
            (previousValue, currentValue) =>
                previousValue.updatedAt.getTime() > currentValue.updatedAt.getTime() ? previousValue : currentValue,
            blogEntryBodies[0],
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
    const isUpdatedEntry = (publishAt: Date, updatedAt: Date, marginSecond: number): boolean => {
        const duration: DurationLikeObject = { second: marginSecond };
        return isBetweenDate(publishAt, plusDate(updatedAt, duration), minusDate(updatedAt, duration));
    };

    const createTitle = (title: string, publishAt: Date, updatedAt: Date): string => {
        const updatedInfo = isUpdatedEntry(publishAt, updatedAt, 10) ? `, modified: ${toIso8601Date(updatedAt)}` : "";
        return `${title} (${toIso8601Date(publishAt)}${updatedInfo})`;
    };

    return (
        <BaseMenuSection sectionName={`Recent entries`}>
            <ul>
                {recentEntries.map(({ blogEntryId, title, slug, publishAt, updatedAt }) => (
                    <li key={blogEntryId}>
                        <Link to={PathUrl.blog.entryBySlug(slug)}>{createTitle(title, publishAt, updatedAt)}</Link>
                    </li>
                ))}
            </ul>
        </BaseMenuSection>
    );
};
