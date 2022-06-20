import { FC } from "react";

interface BlogPostSummary {
    id: string;
    title: string;
    slug: string;
    isDraft: boolean;
    publishAt: Date;
    updateAt: Date;
}

interface Props {
    posts: BlogPostSummary[];
}

const sortByKey = (posts: BlogPostSummary[], key: keyof BlogPostSummary, order: "asc" | "desc" = "asc") => {
    const orderSign = order === "asc" ? 1 : -1;
    return posts.sort((a, b) => (a[key] > b[key] ? 1 : -1) * orderSign);
};

export const ManagementBlogPostList: FC<Props> = ({ posts }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>title</th>
                    <th>slug</th>
                    <th>published at</th>
                    <th>updated at</th>
                    <th>draft</th>
                </tr>
            </thead>
            <tbody>{}</tbody>
        </table>
    );
};
