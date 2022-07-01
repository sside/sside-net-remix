import { BlogEntry, BlogEntryBodyHistory, BlogMetaTag } from "@prisma/client";

export type PrismaPublishedBlogEntry = BlogEntry & {
    blogEntryBodyHistories: BlogEntryBodyHistory[];
    blogMetaTags: BlogMetaTag[];
};
