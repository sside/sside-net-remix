import { toIso8601DateTime } from "../../libraries/datetime";
import { DateParsedResponseBody } from "../../types/DateParsedResponseBody";

export const convertDateToString = <T>(target: T): DateParsedResponseBody<T> => {
    const converted: Partial<DateParsedResponseBody<T>> = {};
    for (const [key, value] of Object.entries(target)) {
        if (value instanceof Date) {
            // For key access
            // @ts-ignore
            converted[key] = toIso8601DateTime(value);
        } else if (typeof value === "object") {
            // Object type is not proper. This will cause bug. But this project don't use RegExp or any built-in classes in response.
            // @ts-ignore
            converted[key] = convertDateToString(value);
        } else {
            // @ts-ignore
            converted[key] = value;
        }
    }
    return converted as DateParsedResponseBody<T>;
};
