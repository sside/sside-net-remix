import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC, ReactNode } from "react";
import { ProjectColor } from "../../../constants/ProjectColor";
import { CssClassNamePrefix } from "../../../constants/style/CssClassNamePrefix";
import buttonStyle from "../../../styles/utilites/button.css";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => cssLinks(buttonStyle);

interface Props {
    to: string;
    children: ReactNode;
    color?: ProjectColor;
}

export const LinkButton: FC<Props> = ({ to, color, children }) => {
    const className = `button` + (color ? ` ${CssClassNamePrefix.Button}${color}` : "");

    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    );
};
