import { JoinedBlogEntry } from "./JoinedBlogEntry";

export class BlogEntryEditResponse {
    id: string;
    title: string;
    slug: string;
    body: string;
    metaTags: {
        id: string;
        name: string;
    }[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        title: string,
        slug: string,
        body: string,
        metaTags: BlogEntryEditResponse["metaTags"],
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.body = body;
        this.metaTags = metaTags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(entity: JoinedBlogEntry): BlogEntryEditResponse {
        const { blogEntryBodies, blogEntryBodyDraft, id, slug, createdAt, blogMetaTags } = entity;
        const latestEntryBody =
            blogEntryBodyDraft || blogEntryBodies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
        const { title, body, updatedAt } = latestEntryBody;
        return new BlogEntryEditResponse(
            id,
            title,
            slug,
            body,
            blogMetaTags.map(({ id, name }) => ({ id, name })),
            createdAt,
            updatedAt,
        );
    }
}
