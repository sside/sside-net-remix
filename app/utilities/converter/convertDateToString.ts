import { toIso8601Date } from "../../libraries/datetime";
import { DateToString } from "../../types/DateToString";

export const convertDateToString = <T>(target: T): DateToString<T> => {
    const converted: Partial<DateToString<T>> = {};
    for (const [key, value] of Object.entries(target)) {
        if (value instanceof Date) {
            // For key access
            // @ts-ignore
            converted[key] = toIso8601Date(value);
        } else if (typeof value === "object") {
            // Object type is not proper. This will cause bug. But this project don't use RegExp or any built-in classes in response.
            // @ts-ignore
            converted[key] = convertDateToString(value);
        } else {
            // @ts-ignore
            converted[key] = value;
        }
    }
    return converted as DateToString<T>;
};
