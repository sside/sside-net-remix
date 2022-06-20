import { appConfig } from "../../../appConfig";
import { ValueValidator } from "./type/ValueValidator";

export const isValidTitle: ValueValidator = (title) => {
    if (!title) {
        return `Title is not defined`;
    }

    const { maxTitleLength } = appConfig.blog;
    const titleLength = title.length;
    if (titleLength > maxTitleLength) {
        return `Title length over. Length: ${titleLength} Limit: ${maxTitleLength}`;
    }

    return true;
};
