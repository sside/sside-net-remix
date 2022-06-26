export const PathUrl = {
    public: {
        blogRoot: `/`,
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
