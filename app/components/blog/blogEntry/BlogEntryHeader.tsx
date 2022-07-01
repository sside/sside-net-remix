import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";

interface Props {
    title: string;
    slug: string;
}

export const BlogEntryHeader: FC<Props> = ({ title, slug }) => {
    return (
        <header>
            <Link to={PathUrl.blog.entryBySlug(slug)}>{title}</Link>
        </header>
    );
};
