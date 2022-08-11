import { BlogMetaTag } from "@prisma/client";
import { ConflictServerError, InternalServerError, NotFoundServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { Logger } from "../../libraries/logger/logger";

const logger = new Logger(`blogMetaTag`);

export async function findOneBlogMetaTagById(id: string): Promise<BlogMetaTag> {
    logger.log(`Idでblog meta tagを1つ探します。`, {
        id,
    });

    const blogMetaTag = await prisma.blogMetaTag.findUnique({
        where: {
            id,
        },
    });

    if (!blogMetaTag) {
        throw new NotFoundServerError(`Blog meta tagが見つかりませんでした。`, {
            id,
        });
    }

    return blogMetaTag;
}

export async function findOneBlogMetaTagByName(name: string): Promise<BlogMetaTag> {
    logger.log(`Meta tag nameでblog meta tagを1つ探します`, {
        name,
    });

    const blogMetaTag = await prisma.blogMetaTag.findUnique({
        where: {
            name,
        },
    });

    if (!blogMetaTag) {
        throw new NotFoundServerError(`Blog metaが見つかりませんでした。.`, {
            name,
        });
    }

    return blogMetaTag;
}

export async function findAllBlogMetaTags() {
    logger.log(`全てのblog meta tagを取得します。`);

    return await prisma.blogMetaTag.findMany();
}

export async function findAllBlogMetaTagCounts() {
    logger.log(`全てのblog meta tagに紐づけられたエントリー数を取得します。`);

    return await prisma.blogMetaTag.findMany({
        include: {
            _count: true,
        },
    });
}

export async function createBlogMetaTag(name: string): Promise<BlogMetaTag> {
    logger.log(`新しいblog meta tagを作成します。`, {
        name,
    });

    const exist = await prisma.blogMetaTag.findUnique({
        where: {
            name,
        },
    });
    if (exist) {
        throw new InternalServerError(`Blog meta tagは既に作成済みです。`, {
            name,
        });
    }
    return await prisma.blogMetaTag.create({
        data: {
            name,
        },
    });
}

export async function updateBlogMetaTag(id: string, name: string): Promise<BlogMetaTag> {
    logger.log(`既存のblog meta tagの名前を変更します。`, {
        id,
        name,
    });

    const exist = await findOneBlogMetaTagById(id);
    if (!exist) {
        throw new NotFoundServerError(`Blog meta tagが見つかりませんでした。`, {
            id,
        });
    }
    if (exist.name === name) {
        return exist;
    }

    const duplicated = await prisma.blogMetaTag.findUnique({
        where: {
            name,
        },
    });
    if (duplicated) {
        throw new ConflictServerError(`Blog meta tagは既に作成済みです。`, {
            name,
        });
    }

    return await prisma.blogMetaTag.update({
        where: {
            id: exist.id,
        },
        data: {
            name,
        },
    });
}

export async function upsertBlogMetaTags(metaTags: string[]): Promise<BlogMetaTag[]> {
    logger.log(`複数のBlog meta tagをUPSERTします。`, {
        metaTags,
    });

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
        merged.push(await createBlogMetaTag(tag));
    }

    return merged;
}

export async function deleteOneBlogMetaTag(id: string): Promise<void> {
    logger.log(`Blog meta tagを削除します。`, {
        id,
    });

    await prisma.blogMetaTag.delete({
        where: {
            id,
        },
    });

    return;
}
