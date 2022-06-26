import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { ProjectColor } from "../../../../constants/ProjectColor";
import { BaseButton, links as baseButtonLinks } from "../../../global/button/BaseButton";

export const links: LinksFunction = baseButtonLinks;

interface Props {
    text: string;
    id?: string;
    name?: string;
    value?: string;
}

export const ManagementPrimaryButton: FC<Props> = ({ text, id, name, value }) => {
    return <BaseButton text={text} id={id} name={name} type={`submit`} value={value} color={ProjectColor.Blue} />;
};

export const ManagementBasicButton: FC<Props> = ({ text, id, name, value }) => {
    return <BaseButton text={text} id={id} name={name} type={`submit`} value={value} color={ProjectColor.Gray} />;
};

export const ManagementDangerButton: FC<Props> = ({ text, id, name, value }) => {
    return <BaseButton text={text} id={id} name={name} type={`submit`} value={value} color={ProjectColor.Red} />;
};
