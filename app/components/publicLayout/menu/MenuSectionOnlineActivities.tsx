import { LinksFunction } from "@remix-run/node";
import { FC, Fragment } from "react";
import { appConfig, OnlineActivity } from "../../../../appConfig";
import { DangerouslySetInnerHtmlValue } from "../../../types/DangerouslySetInnerHtmlValue";
import { parseMarkdown } from "../../../libraries/markdown/parseMarkdown";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import { BaseMenuSection } from "./BaseMenuSection";
import styles from "./MenuSectionOnlineActivities.css";

export const links: LinksFunction = () => cssLinks(styles);

interface MenuSectionOnlineActivityItemProps {
    activity: OnlineActivity;
}

const MenuSectionOnlineActivityItem: FC<MenuSectionOnlineActivityItemProps> = ({ activity }) => {
    const { serviceName, accountName, serviceUrl } = activity;

    return (
        <Fragment>
            <dt>{serviceName}</dt>
            <dd>{serviceUrl ? <a href={serviceUrl.toString()}>{accountName}</a> : accountName}</dd>
        </Fragment>
    );
};

export const MenuSectionOnlineActivities: FC = () => {
    const messageMarkdown: DangerouslySetInnerHtmlValue = {
        __html: parseMarkdown(appConfig.menu.onlineActivity.messageMarkdown),
    };

    return (
        <BaseMenuSection sectionName={`Online accounts`}>
            <div className={`menuSectionOnlineActivities__message`} dangerouslySetInnerHTML={messageMarkdown} />
            <dl className={`menuSectionOnlineActivities__items`}>
                {appConfig.menu.onlineActivity.activities.map((activity) => (
                    <MenuSectionOnlineActivityItem key={activity.serviceName} activity={activity} />
                ))}
            </dl>
        </BaseMenuSection>
    );
};
