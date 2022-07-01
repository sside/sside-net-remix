import { FC } from "react";
import { appConfig } from "../../../../appConfig";
import { DangerouslySetInnerHtmlValue } from "../../../types/DangerouslySetInnerHtmlValue";
import { parseMarkdown } from "../../../libraries/markdown/parseMarkdown";
import { BaseMenuSection } from "./BaseMenuSection";

export { links } from "./BaseMenuSection";

export const MenuSectionAboutThisSite: FC = () => {
    const aboutMessage: DangerouslySetInnerHtmlValue = {
        __html: parseMarkdown(appConfig.menu.about.messageMarkdown),
    };

    return (
        <BaseMenuSection sectionName={`About this site`}>
            <div dangerouslySetInnerHTML={aboutMessage} />
        </BaseMenuSection>
    );
};
