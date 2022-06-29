import { BlogMetaTag } from "@prisma/client";
import { toIso8601DateTime } from "../../../libraries/datetime";

export class BlogMetaTagClientResponse {
    constructor(readonly id: string, readonly name: string, readonly createdAt: string, readonly updatedAt: string) {}

    static fromEntity(blogMetaTag: BlogMetaTag): BlogMetaTagClientResponse {
        const { id, name, updatedAt, createdAt } = blogMetaTag;
        return {
            id,
            name,
            updatedAt: toIso8601DateTime(updatedAt),
            createdAt: toIso8601DateTime(createdAt),
        };
    }
}
