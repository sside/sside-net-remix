import { appConfig } from "../../../appConfig";
import { ValueValidator } from "./type/ValueValidator";

export const validateBlogEntrySlug: ValueValidator = (slug) => {
    if (!slug) {
        return `Slug is not defined.`;
    }

    const { maxSlugLength } = appConfig.blog;
    const slugLength = slug.length;
    if (slug.length >= maxSlugLength) {
        return `Slug length exceeded maximum. Length: ${slugLength}, MaxLength: ${maxSlugLength}`;
    }

    if (!new RegExp(`^[a-zA-Z0-9-_]+$`).test(slug)) {
        return `Slug contains [a-zA-Z0-9-_] characters only.`;
    }

    return true;
};
