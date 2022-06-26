import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinks } from "../../utilities/styling/cssLinkDescriptor";
import { MarkdownEditor } from "./MarkdownEditor";
import styles from "./ManagementFormBlogBodyInput.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    label: string;
    idAndName: string;
    defaultValue: string;
}

export const ManagementFormBlogBodyInput: FC<Props> = ({ label, idAndName, defaultValue }) => {
    return (
        <fieldset className={`managementFormItemBlogEntry`}>
            <label className={`managementFormItemBlogEntry__label`} htmlFor={idAndName}>
                {label}
            </label>
            <MarkdownEditor defaultValue={defaultValue} id={idAndName} name={idAndName} />
        </fieldset>
    );
};
