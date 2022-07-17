import { QuerySortOrder } from "../../types/QuerySortOrder";

export interface PagingQuery {
    pointerId: string;
    order: QuerySortOrder;
    count: number;
}

export const PathUrl = {
    blog: {
        root: `/blog/`,
        entryBySlug: (slug: string) => `/blog/entry/${slug}/`,
        archive: {
            byYear: (year: number) => `/blog/archive/${year}/`,
            byYearMonth: (year: number, month: number) => `/blog/archive/${year}/${String(month).padStart(2, "0")}/`,
        },
        metaTag: {
            byMetaTag: (metaTag: string) => `/blog/meta_tag/${metaTag}/`,
            byMetaTagWithPaging: (metaTag: string, paging: PagingQuery) =>
                `/blog/meta_tag/${metaTag}/?` +
                Object.entries(paging)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&"),
        },
    },
    management: {
        root: `/management`,
        blog: {
            create: `/management/blog/create/`,
            editById: (id: string) => `/management/blog/${id}/`,
            deleteById: (id: string) => `/management/blog/${id}/delete/`,
        },
        metaTag: {
            create: `/management/meta_tag/create/`,
            updateById: (id: string) => `/management/meta_tag/${id}/update/`,
            deleteById: (id: string) => `/management/meta_tag/${id}/delete/`,
        },
    },
};
