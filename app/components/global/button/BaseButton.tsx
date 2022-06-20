import { LinksFunction } from "@remix-run/node";
import { ButtonHTMLAttributes, FC } from "react";
import { cssLinks } from "../../../utilities/styling/cssDescription";
import styles from "./BaseButton.css";

export const BaseButtonColor = {
    Yellow: "yellow",
    Orange: "orange",
    Red: "red",
    Magenta: "magenta",
    Violet: "violet",
    Blue: "blue",
    Cyan: "cyan",
    Green: "green",
    Gray: "gray",
};
export type ButtonColor = typeof BaseButtonColor[keyof typeof BaseButtonColor];

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    text: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    action?: ButtonHTMLAttributes<HTMLButtonElement>["formAction"];
    value?: ButtonHTMLAttributes<HTMLButtonElement>["value"];
    id?: ButtonHTMLAttributes<HTMLButtonElement>["id"];
    name?: ButtonHTMLAttributes<HTMLButtonElement>["name"];
    color?: ButtonColor;
}

export const BaseButton: FC<Props> = ({ type, text, id, value, name, action, color }) => {
    const BUTTON_COLOR_CLASSNAME_PREFIX = `baseButton__`;
    const buttonColorCssClassName = BUTTON_COLOR_CLASSNAME_PREFIX + (color || BaseButtonColor.Gray);

    return (
        <button
            id={id}
            name={name}
            className={`baseButton ${buttonColorCssClassName}`}
            formAction={action}
            type={type}
            value={value}
        >
            {text}
        </button>
    );
};
