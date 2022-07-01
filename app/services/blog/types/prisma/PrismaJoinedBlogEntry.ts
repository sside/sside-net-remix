import { BlogEntry, BlogEntryBodyDraft, BlogEntryBodyHistory, BlogMetaTag } from "@prisma/client";

export type PrismaJoinedBlogEntry = BlogEntry & {
    blogEntryBodyHistories: BlogEntryBodyHistory[];
    blogEntryBodyDraft: BlogEntryBodyDraft | null;
    blogMetaTags: BlogMetaTag[];
};
