import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { appConfig } from "../../../../appConfig";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./TheHeader.css";

export const links: LinksFunction = () => cssLinks(styles);

export const TheHeader: FC = () => {
    return (
        <header className={`theHeader`}>
            <h1 className={`theHeader__title`}>{appConfig.global.siteName}</h1>
        </header>
    );
};
