import { toIso8601 } from "../../../libraries/datetime";
import { JoinedBlogEntry } from "./JoinedBlogEntry";

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

    static fromEntity(entity: JoinedBlogEntry): BlogEntryEditItemClientResponse {
        const { blogEntryBodies, blogEntryBodyDraft, id, slug, createdAt, blogMetaTags, publishAt } = entity;
        const latestEntryBody =
            blogEntryBodyDraft || blogEntryBodies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
        const isDraft: boolean = !!blogEntryBodyDraft;
        const { title, body, updatedAt } = latestEntryBody;
        return new BlogEntryEditItemClientResponse(
            id,
            title,
            slug,
            body,
            blogMetaTags.map(({ id, name }) => ({ id, name })),
            isDraft,
            toIso8601(createdAt),
            toIso8601(updatedAt),
            publishAt ? toIso8601(publishAt) : null,
        );
    }
}
