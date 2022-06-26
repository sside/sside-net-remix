import { ActionFunction, LinksFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { ProjectColor } from "../../../constants/ProjectColor";
import { ForbiddenServerError } from "../../../error/ServerError";
import { checkLoggedIn } from "../../../services/authentication/checkLoggedIn.server";
import { publishBlogEntry, upsertDraftBlogEntry } from "../../../services/blog/blogEntry.server";
import {
    BlogPostEditorInputName,
    BlogPostEditorSubmitType,
    extractBlogFormData,
} from "../../../services/blog/constants/BlogFormData";
import { cssLinkDescriptor } from "../../../utilities/styling/cssLinkDescriptor";
import { LinkButton, links as linkButtonLinks } from "../../global/button/LinkButton";
import { links as managementFormBlogBodyInputLinks, ManagementFormBlogBodyInput } from "../ManagementFormBlogBodyInput";
import { links as managementFormItemLinks, ManagementFormItemInput } from "../ManagementFormItemInput";
import { links as markdownEditorLinks } from "../MarkdownEditor";
import {
    links as managementButtonLinks,
    ManagementBasicButton,
    ManagementPrimaryButton,
} from "../parts/button/managementButtons";
import styles from "./BlogEntryForm.css";

export const links: LinksFunction = () => [
    cssLinkDescriptor(styles),
    ...markdownEditorLinks(),
    ...managementFormItemLinks(),
    ...managementButtonLinks(),
    ...managementFormBlogBodyInputLinks(),
    ...linkButtonLinks(),
];

export const blogEntryFormAction: ActionFunction = async ({ request }) => {
    await checkLoggedIn(request);

    const form = await request.formData();
    const { blogEntryId, title, slug, body, metaTags, submitType } = extractBlogFormData(form);
    const parsedTags = metaTags.split(",").map((value) => value.trim());

    const { Publish, Draft } = BlogPostEditorSubmitType;
    let redirectId: string;
    switch (submitType) {
        case Publish:
            redirectId = (await publishBlogEntry(title, slug, body, parsedTags, blogEntryId || undefined, new Date()))
                .id;
            break;
        case Draft:
            redirectId = (await upsertDraftBlogEntry(title, slug, body, parsedTags, blogEntryId || undefined)).id;
            break;
        default:
            throw new ForbiddenServerError(`Blog post submit type is not valid`);
    }

    return redirect(PathUrl.management.blog.editById(redirectId));
};

interface Props {
    blogEntryId?: string;
    formHeader: string;
    title: string;
    slug: string;
    body: string;
    metaTags: string[];
}

export const BlogEntryForm: FC<Props> = ({ blogEntryId, formHeader, title, slug, body, metaTags }) => {
    const { BlogEntryId, Title, Slug, Body, Tags, SubmitType } = BlogPostEditorInputName;
    const { Publish, Draft } = BlogPostEditorSubmitType;

    return (
        <Form method="post" className="blogEntryForm">
            <h1 className={`blogEntryForm__header`}>{formHeader.toUpperCase()}</h1>
            <ManagementFormItemInput label={`TITLE`} idAndName={Title} defaultValue={title} />
            <ManagementFormItemInput label={`SLUG`} idAndName={Slug} defaultValue={slug} />
            <ManagementFormItemInput label={`META TAGS`} idAndName={Tags} defaultValue={metaTags.join(", ")} />
            <ManagementFormBlogBodyInput label={`BODY`} idAndName={Body} defaultValue={body} />
            <input type={`hidden`} name={BlogEntryId} defaultValue={blogEntryId} />
            <div className={`blogEntryForm__buttons`}>
                {blogEntryId && (
                    <LinkButton to={PathUrl.management.blog.deleteById(blogEntryId)} color={ProjectColor.Danger}>
                        DELETE ENTRY
                    </LinkButton>
                )}
                <ManagementPrimaryButton text={`UPDATE DRAFT`} name={SubmitType} value={Draft} />
                <ManagementBasicButton text={`PUBLISH ENTRY`} name={SubmitType} value={Publish} />
            </div>
        </Form>
    );
};
