import { UnprocessableServerError } from "../../error/ServerError";
import { validatePagingQuery } from "../../libraries/vallidator/validatePagingQuery";
import { BlogPagingQuery, BlogPagingQueryKey } from "../../types/blog/BlogPagingQuery";
import { QuerySortOrder } from "../../types/database/QuerySortOrder";

export const extractBlogPagingQuery = (url: string): BlogPagingQuery | undefined => {
    const { searchParams } = new URL(url);
    const [pointerId, order, count] = Object.values(BlogPagingQueryKey).map((key) => searchParams.get(key));

    if ([pointerId, order, count].every((value) => !value)) {
        return undefined;
    }

    const result = validatePagingQuery(pointerId, order, count);
    if (typeof result === "string") {
        throw new UnprocessableServerError(result, {
            pointerId,
            order,
            count,
        });
    }

    return {
        pointerId: pointerId!,
        order: order as QuerySortOrder,
        count: parseInt(count!),
    };
};

export const createBlogPagingQuery = (blogPagingQuery: BlogPagingQuery): string => {
    return Object.entries(blogPagingQuery)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
};
