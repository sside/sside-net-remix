import { BlogMetaTag } from "@prisma/client";
import { toIso8601 } from "../../../../libraries/datetime";

export class MetaTagRestResponse {
    constructor(readonly id: string, readonly name: string, readonly createdAt: string, readonly updatedAt: string) {}

    static fromEntity(blogMetaTag: BlogMetaTag): MetaTagRestResponse {
        const { id, name, updatedAt, createdAt } = blogMetaTag;
        return {
            id,
            name,
            createdAt: toIso8601(createdAt),
            updatedAt: toIso8601(updatedAt),
        };
    }
}
