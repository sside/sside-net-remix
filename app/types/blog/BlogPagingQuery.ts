import { QuerySortOrder } from "../database/QuerySortOrder";

export interface BlogPagingQuery {
    pointerId: string;
    order: QuerySortOrder;
    count: number;
}

export const BlogPagingQueryKey = {
    PointerId: "pointerId",
    Order: "order",
    Count: "count",
} as const;
export type BlogPagingQueryKey = typeof BlogPagingQueryKey[keyof typeof BlogPagingQueryKey];
