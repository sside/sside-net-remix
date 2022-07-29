import { BlogEntryBodyHistory } from "@prisma/client";
import { DateParsedResponseBody } from "../../types/utility/DateParsedResponseBody";

export const getLatestBlogEntryBody = <T extends BlogEntryBodyHistory | DateParsedResponseBody<BlogEntryBodyHistory>>(
    bodies: T[],
): T => {
    const errorMessagePrefix = `[${getLatestBlogEntryBody.name}]: `;
    if (!bodies.length) {
        throw new Error(errorMessagePrefix + `入力されたBlog entryの数がゼロです。`);
    }

    return bodies.sort(({ createdAt: a }, { createdAt: b }) => {
        if (typeof a === "string" && typeof b === "string") {
            return a > b ? -1 : 1;
        } else if (a instanceof Date && b instanceof Date) {
            return b.getTime() - a.getTime();
        } else {
            throw new Error(errorMessagePrefix + `入力されたBlogEntryBodyの型が不正です、`);
        }
    })[0];
};
