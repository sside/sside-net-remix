import { LinksFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { FC } from "react";
import { BlogPostEditorInputName, BlogPostEditorSubmitType } from "../../../routes/management/blog/create";
import { cssLinks } from "../../../utilities/styling/cssDescription";
import { ManagementFormItem, links as managementFormItemLinks } from "../ManagementFormItem";
import { MarkdownEditor, links as markdownEditorLinks } from "../MarkdownEditor";
import {
    ManagementBasicButton,
    ManagementPrimaryButton,
    links as managementButtonLinks,
} from "../parts/button/managementButtons";
import styles from "./BlogEntryForm.css";

export const links: LinksFunction = () => [
    ...cssLinks(styles),
    ...markdownEditorLinks(),
    ...managementFormItemLinks(),
    ...managementButtonLinks(),
];

interface Props {
    title: string;
    slug: string;
    body: string;
    tags: string[];
}

export const BlogEntryForm: FC<Props> = ({ title, slug, body, tags }) => {
    const { Title, Slug, Body, Tags, SubmitType } = BlogPostEditorInputName;
    const { Publish, Draft } = BlogPostEditorSubmitType;

    return (
        <Form method="post" className="blogEntryForm">
            <ManagementFormItem label={`Title`} idAndName={Title}>
                <input type="text" id={Title} name={Title} defaultValue={title} />
            </ManagementFormItem>
            <ManagementFormItem label={`Slug`} idAndName={Slug}>
                <input type="text" id={Slug} name={Slug} defaultValue={slug} />
            </ManagementFormItem>
            <ManagementFormItem label={`Tags`} idAndName={Tags}>
                <input type="text" id={Tags} name={Tags} defaultValue={tags.join(", ")} />
            </ManagementFormItem>
            <ManagementFormItem label={`Body`} idAndName={Body}>
                <MarkdownEditor id={Body} name={Body} defaultValue={body} />
            </ManagementFormItem>
            <div className={`blogEntryForm__buttons`}>
                <ManagementPrimaryButton text={`UPDATE DRAFT`} name={SubmitType} value={Draft} />
                <ManagementBasicButton text={`PUBLISH ENTRY`} name={SubmitType} value={Publish} />
            </div>
        </Form>
    );
};
