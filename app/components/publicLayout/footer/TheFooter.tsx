import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { appConfig } from "../../../../appConfig";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./TheFooter.css";

export const links: LinksFunction = () => cssLinks(styles);

export const TheFooter: FC = () => {
    return (
        <footer className={`theFooter`}>
            <span>author: {appConfig.global.ownerName}</span>
            <a href={`https://github.com/sside/sside-net`}>GitHub repository</a>
        </footer>
    );
};
