import { LinksFunction } from "@remix-run/node";
import { FC, ReactNode } from "react";
import { cssLinks } from "../../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogInputContainer.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    label: string;
    htmlFor: string;
    children: ReactNode;
}

export const BlogInputContainer: FC<Props> = ({ children, htmlFor, label }) => {
    return (
        <fieldset className={`blogInputContainer`}>
            <label className={`blogInputContainer__label`} htmlFor={htmlFor}>
                {label}
            </label>
            {children}
        </fieldset>
    );
};
