import { BlogPagingQuery } from "../../types/blog/BlogPagingQuery";
import { createBlogPagingQuery } from "../../utilities/blog/blogPagingQuery";

export const PathUrl = {
    blog: {
        root: `/blog/`,
        rootPaging: (paging: BlogPagingQuery) => PathUrl.blog.root + "?" + createBlogPagingQuery(paging),
        entryBySlug: (slug: string) => PathUrl.blog.root + `entry/${slug}/`,
        archive: {
            root: () => PathUrl.blog.root + `archive/`,
            byYear: (year: number) => PathUrl.blog.archive.root() + `${year}/`,
            byYearPaging: (year: number, paging: BlogPagingQuery) =>
                PathUrl.blog.archive.byYear(year) + "?" + createBlogPagingQuery(paging),
            byYearMonth: (year: number, month: number) =>
                PathUrl.blog.archive.root() + `${year}/${String(month).padStart(2, "0")}/`,
            byYearMonthPaging: (year: number, month: number, paging: BlogPagingQuery) =>
                PathUrl.blog.archive.byYearMonth(year, month) + "?" + createBlogPagingQuery(paging),
        },
        metaTag: {
            byMetaTag: (metaTag: string) => `/blog/meta_tag/${metaTag}/`,
            byMetaTagWithPaging: (metaTag: string, paging: BlogPagingQuery) =>
                `/blog/meta_tag/${metaTag}/?` + createBlogPagingQuery(paging),
        },
    },
    management: {
        root: `/management`,
        blog: {
            root: () => PathUrl.management.root + `blog/`,
            create: () => PathUrl.management.blog.root() + `create/`,
            editById: (id: string) => PathUrl.management.blog.root() + `${id}/`,
            deleteById: (id: string) => PathUrl.management.blog.root() + `${id}/delete/`,
        },
        metaTag: {
            root: () => PathUrl.management + `meta_tag/`,
            create: () => PathUrl.management.metaTag.root() + `create/`,
            byId: (id: string) => PathUrl.management.metaTag.root() + `${id}/`,
            updateById: (id: string) => PathUrl.management.metaTag.byId(id) + `update/`,
            deleteById: (id: string) => PathUrl.management.metaTag.byId(id) + `delete/`,
        },
    },
};
