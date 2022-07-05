import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { appConfig } from "../../../../appConfig";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./TheHeader.css";

export const links: LinksFunction = () => cssLinks(styles);

export const TheHeader: FC = () => {
    return (
        <header className={`theHeader`}>
            <Link className={`theHeader__title`} to={PathUrl.blog.root}>
                <h1>{appConfig.global.siteName}</h1>
            </Link>
        </header>
    );
};
