import { BlogEntry, BlogEntryBodyDraft, BlogEntryBodyHistory, BlogMetaTag } from "@prisma/client";

export type PrismaJoinedBlogEntry = BlogEntry & {
    blogEntryBodies: BlogEntryBodyHistory[];
    blogEntryBodyDraft: BlogEntryBodyDraft | null;
    blogMetaTags: BlogMetaTag[];
};
