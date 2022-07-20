import { BlogEntryBodyHistory } from "@prisma/client";
import { DateParsedResponseBody } from "../../types/utility/DateParsedResponseBody";

export const getLatestBlogEntryBody = <T extends BlogEntryBodyHistory | DateParsedResponseBody<BlogEntryBodyHistory>>(
    bodies: T[],
): T => {
    const errorMessagePrefix = `[${getLatestBlogEntryBody.name}]: `;
    if (!bodies.length) {
        throw new Error(errorMessagePrefix + `Blog entry body count is zero.`);
    }

    return bodies.sort(({ createdAt: a }, { createdAt: b }) => {
        if (typeof a === "string" && typeof b === "string") {
            return a > b ? -1 : 1;
        } else if (a instanceof Date && b instanceof Date) {
            return b.getTime() - a.getTime();
        } else {
            throw new Error(errorMessagePrefix + `Input type is not string or Date.`);
        }
    })[0];
};
