import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import {
    blogEntryFromPublishedBlogEntryEntity,
    link as blogEntryLinks,
} from "../../../../components/blog/blogEntry/BlogEntry";
import { BlogPager, BlogPagerItem, links as blogPagerLinks } from "../../../../components/blog/blogEntry/BlogPager";
import { PathUrl } from "../../../../constants/paths/PathUrl";
import { toErrorResponse, UnprocessableServerError } from "../../../../error/ServerError";
import {
    findBothSidePublishedBlogEntry,
    findOnePublishedBlogEntryBySlug,
} from "../../../../services/blog/findPublishedBlogEntry.server";
import { PrismaJoinedBlogEntry } from "../../../../services/blog/types/prisma/PrismaJoinedBlogEntry";
import { PrismaPublishedBlogEntry } from "../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../../../types/DateParsedResponseBody";
import { getLatestBlogEntryBody } from "../../../../utilities/blog/getLatestBlogEntryBody";

export const links: LinksFunction = () => [...blogEntryLinks(), ...blogPagerLinks()];

export const loader: LoaderFunction = async ({
    params,
}): Promise<[PrismaJoinedBlogEntry, PrismaPublishedBlogEntry | null, PrismaPublishedBlogEntry | null]> => {
    const { slug } = params;
    if (!slug) {
        throw toErrorResponse(new UnprocessableServerError(`slug is not defined`));
    }

    const entry = await findOnePublishedBlogEntryBySlug(slug);
    const [older, younger] = await findBothSidePublishedBlogEntry(entry.id);
    return [entry, older, younger];
};

const BlogSlugRoute: FC = () => {
    const [entry, older, younger] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaJoinedBlogEntry>,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | null,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | null,
            ]
        >();

    const createPagerItem = (
        entry: DateParsedResponseBody<PrismaPublishedBlogEntry> | null | undefined,
        prefix?: string,
    ): BlogPagerItem | undefined =>
        entry
            ? {
                  label: (prefix || "") + getLatestBlogEntryBody(entry.blogEntryBodyHistories).title,
                  url: PathUrl.blog.entryBySlug(entry.slug),
              }
            : undefined;

    const nextItem = createPagerItem(older, "next: ");
    const previousItem = createPagerItem(younger, "previous: ");

    return (
        <Fragment>
            {blogEntryFromPublishedBlogEntryEntity(entry)}
            <BlogPager previous={previousItem} next={nextItem} />
        </Fragment>
    );
};

export default BlogSlugRoute;
