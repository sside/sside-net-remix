import { parseIso8601ToJst } from "../../libraries/datetime";
import { PrismaPublishedBlogEntry } from "../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../types/utility/DateParsedResponseBody";
import { QuerySortOrder } from "../../types/database/QuerySortOrder";

export const sortPublishedBlogEntries = <
    T extends PrismaPublishedBlogEntry[] | DateParsedResponseBody<PrismaPublishedBlogEntry>[],
>(
    publishedBlogEntries: T,
    order: QuerySortOrder = "desc",
): T => {
    const sorted = [...publishedBlogEntries].sort(({ publishAt: a }, { publishAt: b }) => {
        if (typeof a === "string" && typeof b === "string") {
            return parseIso8601ToJst(a).getTime() - parseIso8601ToJst(b).getTime();
        } else if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
        } else {
            throw new Error(`[sortPublishedBlogEntries]: Data type is not valid.`);
        }
    });

    return (order === "asc" ? sorted : sorted.reverse()) as T;
};
