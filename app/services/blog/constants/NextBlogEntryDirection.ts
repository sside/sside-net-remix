export const NextBlogEntryDirection = {
    Old: "old",
    Young: "young",
} as const;
export type NextBlogEntryDirection = typeof NextBlogEntryDirection[keyof typeof NextBlogEntryDirection];
