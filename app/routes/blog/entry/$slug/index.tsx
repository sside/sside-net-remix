import { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
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
import { PrismaPublishedBlogEntry } from "../../../../services/blog/types/prisma/PrismaPublishedBlogEntry";
import { DateParsedResponseBody } from "../../../../types/utility/DateParsedResponseBody";
import { createPageTitle } from "../../../../utilities/blog/createPageTitle";
import { getLatestBlogEntryBody } from "../../../../utilities/blog/getLatestBlogEntryBody";

export const links: LinksFunction = () => [...blogEntryLinks(), ...blogPagerLinks()];

export const loader: LoaderFunction = async ({
    params,
}): Promise<[PrismaPublishedBlogEntry, PrismaPublishedBlogEntry | null, PrismaPublishedBlogEntry | null]> => {
    const { slug } = params;
    if (!slug) {
        throw toErrorResponse(
            new UnprocessableServerError(`slugが未定義です。`, {
                slug,
            }),
        );
    }

    const entry = await findOnePublishedBlogEntryBySlug(slug);
    const [older, younger] = await findBothSidePublishedBlogEntry(entry.id);
    return [entry, older, younger];
};

export const meta: MetaFunction = ({ data }) => {
    if (!data) {
        return {
            title: createPageTitle(`Blog entry not found.`),
        };
    }
    const [entry] = data as [DateParsedResponseBody<PrismaPublishedBlogEntry>];
    return {
        title: createPageTitle(getLatestBlogEntryBody(entry.blogEntryBodyHistories).title),
    };
};

const BlogSlugRoute: FC = () => {
    const [entry, older, younger] =
        useLoaderData<
            [
                DateParsedResponseBody<PrismaPublishedBlogEntry>,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | undefined,
                DateParsedResponseBody<PrismaPublishedBlogEntry> | undefined,
            ]
        >();

    const createPagerItem = (
        entry?: DateParsedResponseBody<PrismaPublishedBlogEntry>,
        prefix?: string,
    ): BlogPagerItem | undefined => {
        if (!entry) {
            return undefined;
        }

        const { blogEntryBodyHistories, slug } = entry;
        return {
            label: (prefix || "") + getLatestBlogEntryBody(blogEntryBodyHistories).title,
            url: PathUrl.blog.entryBySlug(slug),
        };
    };

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
