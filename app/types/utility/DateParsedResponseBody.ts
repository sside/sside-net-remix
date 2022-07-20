type BuiltIn = Date | Function | Error | RegExp;

export type DateParsedResponseBody<T> = T extends BuiltIn
    ? T extends Date
        ? string
        : T
    : { [K in keyof T]: DateParsedResponseBody<T[K]> };

export type DateParsedOrOriginal<T> = T | DateParsedResponseBody<T>;
