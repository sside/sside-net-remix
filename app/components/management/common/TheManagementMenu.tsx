import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { cssLinkDescriptor } from "../../../utilities/styling/cssLinkDescriptor";
import { links as linkButtonLinks } from "../../global/button/LinkButton";
import styles from "./TheManagementMenu.css";

export const links: LinksFunction = () => [cssLinkDescriptor(styles), ...linkButtonLinks()];

export const TheManagementMenu: FC = () => {
    return (
        <header className={`theManagementMenu`}>
            <Link to={PathUrl.public.blogRoot}>
                <h1 className={`theManagementMenu__title`}>sside.net</h1>
            </Link>
            <Link className={`theManagementMenu__item`} to={PathUrl.management.root}>
                MANAGEMENT ROOT
            </Link>
        </header>
    );
};
