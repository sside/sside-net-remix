type BuiltIn = Date | Function | Error | RegExp;

export type DateToString<T> = T extends BuiltIn
    ? T extends Date
        ? string
        : T
    : { [K in keyof T]: DateToString<T[K]> };
