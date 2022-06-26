import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { DateTimeFormat, formatDate } from "../../../libraries/datetime";
import { BlogEntryEditItemClientResponse } from "../../../services/blog/types/BlogEntryEditItemClientResponse";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogEntryList.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    entries: BlogEntryEditItemClientResponse[];
}

const sortByKey = (
    posts: BlogEntryEditItemClientResponse[],
    key: keyof BlogEntryEditItemClientResponse,
    order: "asc" | "desc" = "asc",
) => {
    const orderSign = order === "asc" ? 1 : -1;
    return posts.sort((a, b) => ((a[key] || 0) > (b[key] || 0) ? 1 : -1) * orderSign);
};

export const BlogEntryList: FC<Props> = ({ entries }) => {
    const displayDate = (iso8601: string | null) => (iso8601 ? formatDate(new Date(iso8601), DateTimeFormat.Full) : "");

    return (
        <table className={`blogEntryList`}>
            <thead className={`blogEntryList__header`}>
                <tr className={`blogEntryList__headerRow`}>
                    {["title", "slug", "meta", "draft", "updated at", "published at"].map((headerText, index) => (
                        <th key={index} className={`blogEntryList__headerItem`}>
                            {headerText}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={`blogEntryList__body`}>
                {entries.map(({ id, slug, title, metaTags, isDraft, updatedAt, publishAt }) => (
                    <tr key={id} className={`blogEntryList__bodyRow`}>
                        <td className={`blogEntryList__bodyItem`}>
                            <Link to={PathUrl.management.blog.editById(id)} className={`blogEntryList__bodyItemLink`}>
                                {title}
                            </Link>
                        </td>
                        <td className={`blogEntryList__bodyItem`}>{slug}</td>
                        <td className={`blogEntryList__bodyItem`}>
                            {metaTags.map(({ name }) => (
                                <span key={name}>{name}</span>
                            ))}
                        </td>
                        <td className={`blogEntryList__bodyItem`}>{isDraft ? "true" : "false"}</td>
                        <td className={`blogEntryList__bodyItem`}>{displayDate(updatedAt)}</td>
                        <td className={`blogEntryList__bodyItem`}>{displayDate(publishAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
