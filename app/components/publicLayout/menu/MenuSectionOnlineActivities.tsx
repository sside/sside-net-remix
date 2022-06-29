import { FC, Fragment } from "react";
import { appConfig, OnlineActivity } from "../../../../appConfig";
import { DangerouslySetInnerHtmlValue } from "../../../types/DangerouslySetInnerHtmlValue";
import { parseMarkdown } from "../../../utilities/markdown/parseMarkdown";
import { BaseMenuSection } from "./BaseMenuSection";

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
            <div dangerouslySetInnerHTML={messageMarkdown} />
            <dl>
                {appConfig.menu.onlineActivity.activities.map((activity) => (
                    <MenuSectionOnlineActivityItem key={activity.serviceName} activity={activity} />
                ))}
            </dl>
        </BaseMenuSection>
    );
};
