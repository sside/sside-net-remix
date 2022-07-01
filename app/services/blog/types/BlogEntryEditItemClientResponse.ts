import { toIso8601DateTime } from "../../../libraries/datetime";
import { PrismaJoinedBlogEntry } from "./prisma/PrismaJoinedBlogEntry";

export class BlogEntryEditItemClientResponse {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly slug: string,
        readonly body: string,
        readonly metaTags: {
            id: string;
            name: string;
        }[],
        readonly isDraft: boolean,
        readonly createdAt: string,
        readonly updatedAt: string,
        readonly publishAt: string | null,
    ) {}

    static fromEntity(entity: PrismaJoinedBlogEntry): BlogEntryEditItemClientResponse {
        const { blogEntryBodyHistories, blogEntryBodyDraft, id, slug, createdAt, blogMetaTags, publishAt } = entity;
        const latestEntryBody =
            blogEntryBodyDraft ||
            blogEntryBodyHistories.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
        const isDraft: boolean = !!blogEntryBodyDraft;
        const { title, body, updatedAt } = latestEntryBody;
        return new BlogEntryEditItemClientResponse(
            id,
            title,
            slug,
            body,
            blogMetaTags.map(({ id, name }) => ({ id, name })),
            isDraft,
            toIso8601DateTime(createdAt),
            toIso8601DateTime(updatedAt),
            publishAt ? toIso8601DateTime(publishAt) : null,
        );
    }
}
