export const QuerySortOrder = {
    Asc: "asc",
    Desc: "desc",
} as const;
export type QuerySortOrder = typeof QuerySortOrder[keyof typeof QuerySortOrder];
