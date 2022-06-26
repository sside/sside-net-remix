export const BlogPostEditorInputName = {
    BlogEntryId: "blogEntryId",
    Title: "title",
    Slug: "slug",
    Body: "body",
    Tags: "tags",
    SubmitType: "submitType",
};

export const BlogPostEditorSubmitType = {
    Publish: "publish",
    Draft: "upsertDraft",
};

interface BlogFormData {
    blogEntryId: string | null;
    title: string;
    slug: string;
    metaTags: string;
    body: string;
    submitType: string;
}

export const extractBlogFormData = (formData: FormData): BlogFormData => {
    const { BlogEntryId, Title, Slug, Body, Tags, SubmitType } = BlogPostEditorInputName;

    const blogEntryId = formData.get(BlogEntryId) as string;
    const title = formData.get(Title) as string;
    const slug = formData.get(Slug) as string;
    const body = formData.get(Body) as string;
    const metaTags = formData.get(Tags) as string;
    const submitType = formData.get(SubmitType) as string;

    return {
        blogEntryId,
        title,
        slug,
        body,
        metaTags,
        submitType,
    };
};
