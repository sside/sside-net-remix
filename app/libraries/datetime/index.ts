import { DateTime, DurationLikeObject, ToObjectOutput } from "luxon";
import { isValidMonth } from "../vallidator/isValidMonth";
import { isValidYear } from "../vallidator/isValidYear";

const TimeZone = {
    JST: "Asia/Tokyo",
    UTC: "utc",
};

const Locale = {
    Japan: "ja-JP",
};

export const DateTimeFormat = {
    Full: "yyyy/LL/dd HH:mm:ss",
} as const;
export type DateTimeFormat = typeof DateTimeFormat[keyof typeof DateTimeFormat];

export const DateFormat = {
    YearMonth: "yyyy-LL",
} as const;
export type DateFormat = typeof DateFormat[keyof typeof DateFormat];

export type Format = DateTimeFormat | DateFormat;

const setJst = (dateTime: DateTime): DateTime => dateTime.setZone(TimeZone.JST).setLocale(Locale.Japan);

const parseJstFromDate = (date: Date): DateTime => setJst(DateTime.fromJSDate(date));

export const parseIso8601ToJst = (iso8601: string): Date => setJst(DateTime.fromISO(iso8601)).toJSDate();

export const toIso8601DateTime = (date: Date): string => parseJstFromDate(date).toISO();

export const toIso8601Date = (date: Date): string => parseJstFromDate(date).toISODate();

export const formatDate = (date: Date, format: Format): string => parseJstFromDate(date).toFormat(format);

export const getFullDateTime = (date: Date): ToObjectOutput => {
    return parseJstFromDate(date).toObject();
};

export const isBetweenDate = (target: Date, a: Date, b: Date): boolean => {
    const [firstMilliSecond, lastMilliSecond] = [a, b].map((date) => date.getTime()).sort((a, b) => a - b);
    const targetMilliSecond = target.getTime();
    return firstMilliSecond <= targetMilliSecond && targetMilliSecond <= lastMilliSecond;
};

export const createMonthRange = (year: number, month: number): [Date, Date] => {
    if (!isValidYear(year) || !isValidMonth(month)) {
        throw new Error(`年月の値が正しくありません。year: ${year}, month: ${month}`);
    }

    const jst = setJst(DateTime.local(year, month, 15));
    return [jst.startOf("month").toJSDate(), jst.endOf("month").toJSDate()];
};

export const createYearRange = (year: number): [Date, Date] => {
    if (!isValidYear(year)) {
        throw new Error(`年の値が正しくありません。year:${year}`);
    }
    const jst = setJst(DateTime.local(year, 6, 15));
    return [jst.startOf("year").toJSDate(), jst.endOf("year").toJSDate()];
};

export const plusDate = (date: Date, duration: DurationLikeObject): Date =>
    parseJstFromDate(date).plus(duration).toJSDate();

export const minusDate = (date: Date, duration: DurationLikeObject): Date =>
    parseJstFromDate(date).minus(duration).toJSDate();
