import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinks } from "../../../../utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => cssLinks();

interface Props {
    idAndName: string;
    defaultValue: string;
}

export const BlogFormInput: FC<Props> = ({ defaultValue, idAndName }) => {
    return (
        <input type={`text`} className={`blogFormInput`} id={idAndName} name={idAndName} defaultValue={defaultValue} />
    );
};
