import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC, Fragment } from "react";
import {
    BlogEntryForm,
    blogEntryFormAction,
    links as blogEntryFormLinks,
} from "../../../../components/management/blog/input/BlogEntryForm";
import { NotFoundServerError, toErrorResponse } from "../../../../error/ServerError";
import { findAllBlogMetaTags } from "../../../../services/blog-meta-tag/blogMetaTag.server";
import { findOneBlogEntryById } from "../../../../services/blog/blogEntry.server";
import { BlogEntryEditItemClientResponse } from "../../../../types/response/BlogEntryEditItemClientResponse";

export const links: LinksFunction = () => [...blogEntryFormLinks()];

export const action: ActionFunction = blogEntryFormAction;

export const loader: LoaderFunction = async ({ params }) => {
    const { blogEntryId } = params;
    if (!blogEntryId) {
        return toErrorResponse(new NotFoundServerError());
    }
    return [
        BlogEntryEditItemClientResponse.fromEntity(await findOneBlogEntryById(blogEntryId)),
        (await findAllBlogMetaTags()).map(({ name }) => name),
    ];
};

const BlogEntryId: FC = () => {
    const [entry, existMetaTags] = useLoaderData<[BlogEntryEditItemClientResponse, string[]]>();
    const { id, title, slug, body, metaTags } = entry;

    return (
        <Fragment>
            <BlogEntryForm
                blogEntryId={id}
                formHeader={`Update blog entry`}
                title={title}
                slug={slug}
                body={body}
                metaTags={metaTags.map(({ name }) => name)}
                allExistMetaTags={existMetaTags}
            />
        </Fragment>
    );
};

export default BlogEntryId;
