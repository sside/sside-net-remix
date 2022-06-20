import { LinksFunction } from "@remix-run/node";
import { FC, ReactNode } from "react";
import { cssLinks } from "../../utilities/styling/cssDescription";
import styles from "./ManagementFormItem.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    label: string;
    idAndName: string;
    children: ReactNode;
}

export const ManagementFormItem: FC<Props> = ({ label, idAndName, children }) => {
    return (
        <fieldset className={`managementFormItem`}>
            <label className={`managementFormItem__label`} htmlFor={idAndName}>
                {label}
            </label>
            {children}
        </fieldset>
    );
};
