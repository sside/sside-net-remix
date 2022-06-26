import { appConfig } from "../../../appConfig";
import { ValuesValidator, ValueValidator } from "./type/ValueValidator";

export const validateBlogEntryMetaTag: ValueValidator = (metaTag) => {
    if (!metaTag) {
        return `Meta tag is not defined.`;
    }

    const { maxMetaTagLength } = appConfig.blog;
    const metaTagLength = metaTag.length;
    if (metaTagLength > maxMetaTagLength) {
        return `Meta tag length exceeded maximum. Length: ${metaTagLength}, Max:${maxMetaTagLength}`;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(metaTag)) {
        return `Meta tag must be ^[a-zA-Z0-9-_]+$ format.`;
    }

    return true;
};

export const validateBlogEntryMetaTags: ValuesValidator = (metaTags) => {
    const result = metaTags.map(validateBlogEntryMetaTag).filter((result) => typeof result === "string");
    return result.length > 0 ? result.join(", ") : true;
};
