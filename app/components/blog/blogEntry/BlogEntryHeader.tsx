import { FC } from "react";

interface Props {
    title: string;
}

export const BlogEntryHeader: FC<Props> = ({ title }) => {
    return <title>{title}</title>;
};
