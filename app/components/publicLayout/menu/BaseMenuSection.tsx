import { LinksFunction } from "@remix-run/node";
import { FC, ReactNode } from "react";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BaseMenuSection.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    sectionName: string;
    children: ReactNode;
}

export const BaseMenuSection: FC<Props> = ({ sectionName, children }) => {
    return (
        <section className={`baseMenuSection`}>
            <header className={`baseMenuSection__header`}>{sectionName}</header>
            <div className={`baseMenuSection__body`}>{children}</div>
        </section>
    );
};
