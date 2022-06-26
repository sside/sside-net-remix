import { LinksFunction } from "@remix-run/node";
import { ButtonHTMLAttributes, FC, MouseEventHandler } from "react";
import { ProjectColor } from "../../../constants/ProjectColor";
import { CssClassNamePrefix } from "../../../constants/style/CssClassNamePrefix";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import buttonStyles from "../../../styles/utilites/button.css";

export const links: LinksFunction = () => cssLinks(buttonStyles);

interface Props {
    text: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    action?: ButtonHTMLAttributes<HTMLButtonElement>["formAction"];
    value?: ButtonHTMLAttributes<HTMLButtonElement>["value"];
    id?: ButtonHTMLAttributes<HTMLButtonElement>["id"];
    name?: ButtonHTMLAttributes<HTMLButtonElement>["name"];
    color?: ProjectColor;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const BaseButton: FC<Props> = ({ type, text, id, value, name, action, color, onClick }) => {
    const buttonClassName = color ? CssClassNamePrefix.Button + color : ``;

    return (
        <button
            id={id}
            name={name}
            className={`button ${buttonClassName}`}
            formAction={action}
            type={type}
            value={value}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
