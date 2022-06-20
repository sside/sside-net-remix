import { appConfig } from "../../../appConfig";
import { ValuesValidator, ValueValidator } from "./type/ValueValidator";

export const isValidMetaTag: ValueValidator = (metaTag) => {
    if (!metaTag) {
        return `MetaTag is not defined.`;
    }

    const { maxMetaTagLength } = appConfig.blog;
    const metaTagLength = metaTag.length;
    if (metaTagLength > maxMetaTagLength) {
        return `MetaTag length exceeded maximum. Length: ${metaTagLength}, Max:${maxMetaTagLength}`;
    }

    return true;
};

export const isValidMetaTags: ValuesValidator = (metaTags) => {
    const result = metaTags.map(isValidMetaTag).filter((result) => typeof result === "string");
    return result.length > 0 ? result.join(", ") : true;
};
