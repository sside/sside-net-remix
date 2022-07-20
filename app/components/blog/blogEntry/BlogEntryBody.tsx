import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { parseMarkdown } from "../../../libraries/markdown/parseMarkdown";
import { DangerouslySetInnerHtmlValue } from "../../../types/frontend/react/DangerouslySetInnerHtmlValue";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogEntryBody.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    bodyMarkdown: string;
}

export const BlogEntryBody: FC<Props> = ({ bodyMarkdown }) => {
    const body: DangerouslySetInnerHtmlValue = { __html: parseMarkdown(bodyMarkdown) };

    return <div className={`blogEntryBody`} dangerouslySetInnerHTML={body} />;
};
