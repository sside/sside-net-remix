import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { toIso8601DateTime } from "../../../libraries/datetime";
import { isUpdatedEntry } from "../../../utilities/blog/isUpdatedBlogEntry";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogEntryHeader.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    title: string;
    slug: string;
    publishAt: Date;
    updatedAt: Date;
}

export const BlogEntryHeader: FC<Props> = ({ title, slug, publishAt, updatedAt }) => {
    const [publishAtIso8601, updatedAtIso8601] = [publishAt, updatedAt].map((date) => toIso8601DateTime(date));

    return (
        <header className={`blogEntryHeader`}>
            <Link className={`blogEntryHeader__title`} to={PathUrl.blog.entryBySlug(slug)}>
                {title}
            </Link>
            <section className={`blogEntryHeader__publish`}>
                <time dateTime={publishAtIso8601}>publish: {publishAtIso8601}</time>
                {isUpdatedEntry(publishAt, updatedAt, 0) && (
                    <time dateTime={updatedAtIso8601}>update: {updatedAtIso8601}</time>
                )}
            </section>
        </header>
    );
};
