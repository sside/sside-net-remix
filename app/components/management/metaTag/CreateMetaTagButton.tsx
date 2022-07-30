import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { putClient } from "../../../libraries/api-client/apiClient";
import { validateBlogEntryMetaTag } from "../../../libraries/vallidator/validateBlogEntryMetaTag";
import { CreateNewMetaTagRequest } from "../../../routes/management/meta_tag/create";
import { BaseButton, links as baseButtonLinks } from "../../global/button/BaseButton";

export const links: LinksFunction = () => [...baseButtonLinks()];

export const CreateMetaTagButton: FC = () => {
    const createNewMetaTag = async () => {
        const tagName = prompt(`Input meta tag name.`);

        if (!tagName) {
            return;
        }

        const validateResult = validateBlogEntryMetaTag(tagName);
        if (validateResult !== true) {
            alert(validateResult);
            return;
        }

        try {
            await putClient(PathUrl.management.metaTag.create(), new CreateNewMetaTagRequest(tagName));
        } catch (e) {
            console.log(e);
            alert(`Meta tag creation failed`);
            return;
        }

        location.reload();
    };

    return <BaseButton text={`CREATE META TAG`} type={`button`} onClick={createNewMetaTag} />;
};
