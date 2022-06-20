import { BlogEntry, BlogEntryBodyDraft, BlogEntryBodyHistory, BlogMetaTag } from "@prisma/client";

export type JoinedBlogEntry = BlogEntry & {
    blogEntryBodies: BlogEntryBodyHistory[];
    blogEntryBodyDraft: BlogEntryBodyDraft | null;
    blogMetaTags: BlogMetaTag[];
};
