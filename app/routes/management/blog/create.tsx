import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import {
    BlogEntryForm,
    blogEntryFormAction,
    links as postBlogEditorLinks,
} from "../../../components/management/blog/input/BlogEntryForm";
import { findAllBlogMetaTags } from "../../../services/blog-meta-tag/blogMetaTag.server";

export const links: LinksFunction = () => [...postBlogEditorLinks()];

export const action: ActionFunction = blogEntryFormAction;

export const loader: LoaderFunction = async () => {
    return (await findAllBlogMetaTags()).map(({ name }) => name);
};

const Create: FC = () => {
    const existMetaTags = useLoaderData<string[]>();

    return (
        <Fragment>
            <BlogEntryForm
                formHeader={`Create blog entry`}
                title={``}
                slug={``}
                body={``}
                metaTags={[]}
                allExistMetaTags={existMetaTags}
            />
        </Fragment>
    );
};

export default Create;
