import { LoaderFunction } from "@remix-run/node";
import { SitemapItem, SitemapStream, streamToPromise } from "sitemap";
import { appConfig } from "../../../appConfig";
import { ContentType } from "../../constants/content-type/ContentType";
import { PathUrl } from "../../constants/paths/PathUrl";
import { InternalServerError, toErrorResponse } from "../../error/ServerError";
import { toIso8601Date } from "../../libraries/datetime";
import { Logger } from "../../libraries/logger/logger";
import {
    findAllPublishedBlogEntrySitemapData,
    findManyPublishedBlogEntryRecent,
} from "../../services/blog/findPublishedBlogEntry.server";
import { getLatestBlogEntryBody } from "../../utilities/blog/getLatestBlogEntryBody";
import { removeTrailingSlash } from "../../utilities/url/removeTrailingSlash";

const logger = new Logger(`sitemap`);

export const loader: LoaderFunction = async () => {
    logger.log(`サイトマップを生成します。`);

    const siteRoot = removeTrailingSlash(appConfig.global.siteRoot);
    const createRouteUrl = (pathFromSlash: string): string => {
        return siteRoot + pathFromSlash;
    };

    try {
        const stream = new SitemapStream({
            hostname: appConfig.global.siteRoot,
            xmlns: {
                image: false,
                video: false,
                news: false,
                xhtml: false,
            },
        });

        // Blogのルート
        const latestEntry = await findManyPublishedBlogEntryRecent(1);
        if (latestEntry.length) {
            const { updatedAt } = getLatestBlogEntryBody(latestEntry[0].blogEntryBodyHistories);
            stream.write({
                url: createRouteUrl(PathUrl.blog.root),
                changefreq: "daily",
                lastmod: toIso8601Date(updatedAt),
            } as SitemapItem);
        }

        const publishedEntries = await findAllPublishedBlogEntrySitemapData();
        for (const { slug, blogEntryBodyHistories } of publishedEntries) {
            const { updatedAt } = blogEntryBodyHistories[0];
            stream.write({
                url: createRouteUrl(PathUrl.blog.entryBySlug(slug)),
                changefreq: "yearly",
                lastmod: toIso8601Date(updatedAt),
            } as SitemapItem);
        }
        stream.end();

        return new Response(await streamToPromise(stream).then((data) => data.toString()), {
            headers: ContentType.Sitemap,
        });
    } catch (e) {
        throw toErrorResponse(new InternalServerError((e as Error).message));
    }
};
