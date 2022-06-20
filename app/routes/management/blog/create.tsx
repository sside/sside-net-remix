import { ActionFunction, LinksFunction, redirect } from "@remix-run/node";
import { FC, Fragment } from "react";
import { BlogEntryForm, links as postBlogEditorLinks } from "../../../components/management/blog/BlogEntryForm";
import { ForbiddenServerError } from "../../../error/ServerError";
import { Logger } from "../../../libraries/logger/logger";
import { publishBlogEntry, upsertDraftBlogEntry } from "../../../services/blog/blogEntry.server";

export const BlogPostEditorInputName = {
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

export const links: LinksFunction = () => [...postBlogEditorLinks()];

export const action: ActionFunction = async ({ request }) => {
    const logger = new Logger(request.url);

    const { Title, Slug, Body, Tags, SubmitType } = BlogPostEditorInputName;
    const form = await request.formData();

    const title = form.get(Title) as string;
    const slug = form.get(Slug) as string;
    const body = form.get(Body) as string;
    const tags = form.get(Tags) as string;
    const submitType = form.get(SubmitType) as string;

    logger.log("", {
        title,
        slug,
        body,
        tags,
        submitType,
    });

    const { Publish, Draft } = BlogPostEditorSubmitType;
    const parsedTags = tags.split(",").map((value) => value.trim());
    switch (submitType) {
        case Publish:
            const { id: createdEntryId } = await publishBlogEntry(title, slug, body, parsedTags, undefined, new Date());
            return redirect(`/management/blog/${createdEntryId}`);
        case Draft:
            const { id: draftEntryId } = await upsertDraftBlogEntry(title, slug, body, parsedTags);
            return redirect(`/management/blog/${draftEntryId}`);
        default:
            throw new ForbiddenServerError(`Blog post submit type is not valid`);
    }
};

const Create: FC = () => {
    return (
        <Fragment>
            <h1>blog entry create</h1>
            <BlogEntryForm title={``} slug={``} body={``} tags={[]} />
        </Fragment>
    );
};

export default Create;
