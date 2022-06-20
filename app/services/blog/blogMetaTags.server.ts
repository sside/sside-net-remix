import { BlogMetaTag } from "@prisma/client";
import { prisma } from "../../libraries/database/database";

export async function findAllBlogMetaTags() {
    return await prisma.blogMetaTag.findMany();
}

export async function upsertBlogMetaTags(metaTags: string[]): Promise<BlogMetaTag[]> {
    const exists = await prisma.blogMetaTag.findMany({
        where: {
            name: {
                in: metaTags,
            },
        },
    });

    const existTagNames = exists.map(({ name }) => name);
    const merged = [...exists];
    for (const tag of metaTags.filter((metaTag) => !existTagNames.includes(metaTag))) {
        merged.push(
            await prisma.blogMetaTag.create({
                data: {
                    name: tag,
                },
            }),
        );
    }
    return merged;
}

export async function deleteOneBlogMetaTag(id: string): Promise<void> {
    await prisma.blogMetaTag.delete({
        where: {
            id,
        },
    });

    return;
}
