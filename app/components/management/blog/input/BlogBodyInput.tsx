import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinks } from "../../../../utilities/styling/cssLinkDescriptor";
import { MarkdownEditor } from "../../markdown/MarkdownEditor";
import styles from "./BlogBodyInput.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    label: string;
    idAndName: string;
    defaultValue: string;
}

export const BlogBodyInput: FC<Props> = ({ label, idAndName, defaultValue }) => {
    return (
        <fieldset className={`managementFormItemBlogEntry`}>
            <label className={`managementFormItemBlogEntry__label`} htmlFor={idAndName}>
                {label}
            </label>
            <MarkdownEditor defaultValue={defaultValue} idMustBeUniqueInPage={idAndName} name={idAndName} />
        </fieldset>
    );
};
