import { LoaderFunction } from "@remix-run/node";
import { Author, Feed } from "feed";
import { appConfig } from "../../../../appConfig";
import { ContentType } from "../../../constants/content-type/ContentType";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { DateFormat, formatDate } from "../../../libraries/datetime";
import { parseMarkdown } from "../../../libraries/markdown/parseMarkdown";
import { findManyPublishedBlogEntryRecent } from "../../../services/blog/findPublishedBlogEntry.server";
import { getLatestBlogEntryBody } from "../../../utilities/blog/getLatestBlogEntryBody";
import { sortPublishedBlogEntries } from "../../../utilities/blog/sortPublishedBlogEntries";

export const loader: LoaderFunction = async () => {
    const { global, blog } = appConfig;
    const { siteName, ownerName } = global;
    const { recentEntriesCount } = blog.feed;

    const latestEntries = await findManyPublishedBlogEntryRecent(recentEntriesCount);
    const descSortedEntries = sortPublishedBlogEntries(latestEntries);

    const { atom } = PathUrl.blog.feed;
    const author: Author = {
        name: ownerName,
    };

    const feed = new Feed({
        title: siteName,
        description: `${siteName} blog`,
        id: atom(),
        link: atom(),
        copyright: `${ownerName} all right reserved. ${formatDate(new Date(), DateFormat.Year)}.`,
        updated: descSortedEntries[0].publishAt!,
        feedLinks: {
            atom: atom(),
        },
        author,
    });

    for (const entry of descSortedEntries) {
        const { blogEntryBodyHistories, slug, publishAt } = entry;
        const { title, body, updatedAt } = getLatestBlogEntryBody(blogEntryBodyHistories);
        const link = PathUrl.blog.entryBySlug(slug);

        feed.addItem({
            title,
            link,
            id: link,
            date: updatedAt,
            author: [author],
            content: parseMarkdown(body),
            published: publishAt!,
        });
    }

    return new Response(feed.atom1(), {
        headers: ContentType.Atom,
    });
};
