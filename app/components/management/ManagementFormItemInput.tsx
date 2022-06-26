import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { cssLinks } from "../../utilities/styling/cssLinkDescriptor";
import styles from "./ManagementFormItemInput.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    label: string;
    idAndName: string;
    defaultValue: string;
}

export const ManagementFormItemInput: FC<Props> = ({ label, idAndName, defaultValue }) => {
    return (
        <fieldset className={`managementFormItemInput`}>
            <label className={`managementFormItemInput__label`} htmlFor={idAndName}>
                {label}
            </label>
            <input
                type="text"
                className={`managementFormItemInput__input`}
                id={idAndName}
                name={idAndName}
                defaultValue={defaultValue}
            />
        </fieldset>
    );
};
