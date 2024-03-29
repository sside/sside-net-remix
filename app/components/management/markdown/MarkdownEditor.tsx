import { LinksFunction } from "@remix-run/node";
import easyMdeStyles from "easymde/dist/easymde.min.css";
import { FC, useEffect } from "react";
import { isClientSide } from "../../../utilities/isClientSide";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import markdownEditorStyle from "./MarkdownEditor.css";

export const links: LinksFunction = () => cssLinks(easyMdeStyles, markdownEditorStyle);

interface Props {
    defaultValue: string;
    idMustBeUniqueInPage: string;
    name: string;
}

export const MarkdownEditor: FC<Props> = ({ defaultValue, idMustBeUniqueInPage, name }) => {
    useEffect(() => {
        if (isClientSide() && !document.querySelector(".EasyMDEContainer")) {
            const EasyMDE = require("easymde");
            const easyMde = new EasyMDE({
                element: document.getElementById(idMustBeUniqueInPage),
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
            return () => {
                console.debug("clean up");
                easyMde.cleanup();
            };
        }
    });

    return <textarea id={idMustBeUniqueInPage} name={name} defaultValue={defaultValue} />;
};
