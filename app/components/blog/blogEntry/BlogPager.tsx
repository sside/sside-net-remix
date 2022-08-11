import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC, Fragment } from "react";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogPager.css";

export const links: LinksFunction = () => cssLinks(styles);

export interface BlogPagerItem {
    label: string;
    url: string;
}

interface Props {
    previous?: BlogPagerItem;
    next?: BlogPagerItem;
}

export const BlogPager: FC<Props> = ({ previous, next }) => {
    return (
        <Fragment>
            {(previous || next) && (
                <nav className={`blogPager`}>
                    {previous && (
                        <Link to={previous.url} className={`blogPager__link--previous`}>
                            {previous.label}
                        </Link>
                    )}
                    {next && (
                        <Link to={next.url} className={`blogPager__link--next`}>
                            {next.label}
                        </Link>
                    )}
                </nav>
            )}
        </Fragment>
    );
};
