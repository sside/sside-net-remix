import { DateTime, DurationLikeObject } from "luxon";

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

export const isBetweenDate = (target: Date, a: Date, b: Date): boolean => {
    const [firstMilliSecond, lastMilliSecond] = [a, b].map((date) => date.getTime()).sort((a, b) => a - b);
    const targetMilliSecond = target.getTime();
    return firstMilliSecond <= targetMilliSecond && targetMilliSecond <= lastMilliSecond;
};

export const plusDate = (date: Date, duration: DurationLikeObject): Date =>
    parseJstFromDate(date).plus(duration).toJSDate();

export const minusDate = (date: Date, duration: DurationLikeObject): Date =>
    parseJstFromDate(date).minus(duration).toJSDate();
