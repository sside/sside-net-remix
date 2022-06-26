import { ActionFunction, json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import {
    BlogEntryForm,
    blogEntryFormAction,
    links as blogEntryFormLinks,
} from "../../../../components/management/blog/BlogEntryForm";
import { NotFoundServerError, toErrorResponse } from "../../../../error/ServerError";
import { findOneBlogEntryById } from "../../../../services/blog/blogEntry.server";
import { BlogEntryEditItemClientResponse } from "../../../../services/blog/types/BlogEntryEditItemClientResponse";

export const links: LinksFunction = () => [...blogEntryFormLinks()];

export const action: ActionFunction = blogEntryFormAction;

export const loader: LoaderFunction = async ({ params }) => {
    const { blogEntryId } = params;
    if (!blogEntryId) {
        return toErrorResponse(new NotFoundServerError());
    }
    return json(BlogEntryEditItemClientResponse.fromEntity(await findOneBlogEntryById(blogEntryId)));
};

const BlogEntryId: FC = () => {
    const { id, title, slug, body, metaTags } = useLoaderData<BlogEntryEditItemClientResponse>();

    return (
        <Fragment>
            <BlogEntryForm
                blogEntryId={id}
                formHeader={`Update blog entry`}
                title={title}
                slug={slug}
                body={body}
                metaTags={metaTags.map(({ name }) => name)}
            />
        </Fragment>
    );
};

export default BlogEntryId;
