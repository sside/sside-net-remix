import { BlogEntry, BlogEntryBodyHistory, BlogMetaTag } from "@prisma/client";

export type PrismaPublishedBlogEntry = BlogEntry & {
    blogEntryBodies: BlogEntryBodyHistory[];
    blogMetaTags: BlogMetaTag[];
};
