import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { appConfig } from "../../../../appConfig";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./TheFooter.css";

export const links: LinksFunction = () => cssLinks(styles);

export const TheFooter: FC = () => {
    return (
        <footer className={`theFooter`}>
            <section className={`theFooter__author`}>
                <span>author: {appConfig.global.ownerName}</span>
            </section>
            <section className={`theFooter__icons`}>
                <a href={`https://github.com/sside/sside-net`}>
                    <img
                        alt={`GitHub repository`}
                        className={`theFooter__githubIcon`}
                        src={PathUrl.asset.gitHubIcon()}
                    />
                </a>
            </section>
        </footer>
    );
};
