import { toIso8601Date } from "../../libraries/datetime";
import { DateToString } from "../../types/DateToString";

export const convertDateToString = <T>(target: T): DateToString<T> => {
    const converted: Partial<DateToString<T>> = {};
    for (const [key, value] of Object.entries(target)) {
        if (value instanceof Date) {
            // For key access
            // @ts-ignore
            converted[key] = toIso8601Date(value);
        } else {
            // @ts-ignore
            converted[key] = value;
        }
    }
    return converted as DateToString<T>;
};
