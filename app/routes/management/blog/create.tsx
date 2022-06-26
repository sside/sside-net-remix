import { ActionFunction, LinksFunction } from "@remix-run/node";
import { FC, Fragment } from "react";
import {
    BlogEntryForm,
    blogEntryFormAction,
    links as postBlogEditorLinks,
} from "../../../components/management/blog/BlogEntryForm";

export const links: LinksFunction = () => [...postBlogEditorLinks()];

export const action: ActionFunction = blogEntryFormAction;

const Create: FC = () => {
    return (
        <Fragment>
            <BlogEntryForm formHeader={`Create blog entry`} title={``} slug={``} body={``} metaTags={[]} />
        </Fragment>
    );
};

export default Create;
