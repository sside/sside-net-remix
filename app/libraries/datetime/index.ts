import { DateTime } from "luxon";

const TimeZone = {
    JST: "Asia/Tokyo",
    UTC: "utc",
};

const Locale = {
    Japan: "ja-JP",
};

export const DateTimeFormat = {
    Full: "yyyy/LL/dd HH:mm:ss",
};
export type DateTimeFormat = typeof DateTimeFormat[keyof typeof DateTimeFormat];

export type Format = DateTimeFormat;

const setJst = (dateTime: DateTime): DateTime => dateTime.setZone(TimeZone.JST).setLocale(Locale.Japan);

const parseJstFromDate = (date: Date): DateTime => setJst(DateTime.fromJSDate(date));

export const parseIso8601ToJst = (iso8601: string): Date => setJst(DateTime.fromISO(iso8601)).toJSDate();

export const toIso8601 = (date: Date): string => parseJstFromDate(date).toISO();

export const formatDate = (date: Date, format: Format): string => parseJstFromDate(date).toFormat(format);
