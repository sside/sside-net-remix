import { BlogMetaTag } from "@prisma/client";
import { ConflictServerError, InternalServerError, NotFoundServerError } from "../../error/ServerError";
import { prisma } from "../../libraries/database/database";
import { Logger } from "../../libraries/logger/logger";

const logger = new Logger(`blogMetaTag`);

export async function findOneBlogMetaTagById(id: string): Promise<BlogMetaTag> {
    logger.log(`Find one meta tag.`, {
        id,
    });

    const blogMetaTag = await prisma.blogMetaTag.findUnique({
        where: {
            id,
        },
    });

    if (!blogMetaTag) {
        throw new NotFoundServerError(`Blog meta tag not found. Id:${id}`);
    }

    return blogMetaTag;
}

export async function findOneBlogMetaTagByName(name: string): Promise<BlogMetaTag> {
    logger.log(`Find one meta tag. (find by tag name)`, {
        name,
    });

    const blogMetaTag = await prisma.blogMetaTag.findUnique({
        where: {
            name,
        },
    });

    if (!blogMetaTag) {
        throw new NotFoundServerError(`Blog meta tag not found. Name:${name}`);
    }

    return blogMetaTag;
}

export async function findAllBlogMetaTags() {
    logger.log(`Find all meta tags.`);

    return await prisma.blogMetaTag.findMany();
}

export async function findAllBlogMetaTagCounts() {
    logger.log(`Find all blog meta tag counts.`);

    return await prisma.blogMetaTag.findMany({
        include: {
            _count: true,
        },
    });
}

export async function createBlogMetaTag(name: string): Promise<BlogMetaTag> {
    logger.log(`Create new meta tag`, {
        name,
    });

    const exist = await prisma.blogMetaTag.findUnique({
        where: {
            name,
        },
    });
    if (exist) {
        throw new InternalServerError();
    }
    return await prisma.blogMetaTag.create({
        data: {
            name,
        },
    });
}

export async function updateBlogMetaTag(id: string, name: string): Promise<BlogMetaTag> {
    logger.log(`Update exist meta tag.`, {
        id,
        name,
    });

    const exist = await findOneBlogMetaTagById(id);
    if (!exist) {
        throw new NotFoundServerError(`Blog meta tag is not exists. Id: ${id}`);
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
        throw new ConflictServerError(`Blog meta tag is exists. Name: ${name}`);
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
    logger.log(`Upsert meta tags.`, {
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
    logger.log(`Delete exist meta tag.`, {
        id,
    });

    await prisma.blogMetaTag.delete({
        where: {
            id,
        },
    });

    return;
}
