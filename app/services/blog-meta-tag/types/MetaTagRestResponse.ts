import { BlogMetaTag } from "@prisma/client";
import { toIso8601DateTime } from "../../../libraries/datetime";

export class MetaTagRestResponse {
    constructor(readonly id: string, readonly name: string, readonly createdAt: string, readonly updatedAt: string) {}

    static fromEntity(blogMetaTag: BlogMetaTag): MetaTagRestResponse {
        const { id, name, updatedAt, createdAt } = blogMetaTag;
        return {
            id,
            name,
            createdAt: toIso8601DateTime(createdAt),
            updatedAt: toIso8601DateTime(updatedAt),
        };
    }
}
