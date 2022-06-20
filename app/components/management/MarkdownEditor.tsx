import { LinksFunction } from "@remix-run/node";
import easyMdeStyles from "easymde/dist/easymde.min.css";
import { FC, useEffect } from "react";
import { isClientSide } from "../../utilities/isClientSide";
import { cssLinks } from "../../utilities/styling/cssDescription";
import markdownEditorStyle from "./MarkdownEditor.css";

export const links: LinksFunction = () => [...cssLinks(easyMdeStyles, markdownEditorStyle)];

interface Props {
    defaultValue: string;
    id: string;
    name: string;
}

export const MarkdownEditor: FC<Props> = ({ defaultValue, id, name }) => {
    useEffect(() => {
        if (isClientSide()) {
            const EasyMDE = require("easymde");
            new EasyMDE({
                element: document.getElementById(id),
                status: false,
                lineNumbers: true,
                theme: `markdownEditor`,
                toolbar: [
                    "undo",
                    "redo",
                    "bold",
                    "italic",
                    "quote",
                    "strikethrough",
                    "code",
                    "unordered-list",
                    "ordered-list",
                    "link",
                    "image",
                    "table",
                    "horizontal-rule",
                    "guide",
                ],
            });
        }
    });

    return <textarea id={id} name={name} defaultValue={defaultValue} />;
};
