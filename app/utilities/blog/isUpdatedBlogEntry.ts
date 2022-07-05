import { DurationLikeObject } from "luxon";
import { isBetweenDate, minusDate, plusDate } from "../../libraries/datetime";

export const isUpdatedEntry = (publishAt: Date, updatedAt: Date, marginSecond: number): boolean => {
    const duration: DurationLikeObject = { second: marginSecond };
    return !isBetweenDate(publishAt, plusDate(updatedAt, duration), minusDate(updatedAt, duration));
};
