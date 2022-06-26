import { ActionFunction } from "@remix-run/node";
import { isDeleteRequest } from "../../../../constants/HttpMethodName";
import { MethodNotAllowedServerError, toErrorResponse, UnprocessableServerError } from "../../../../error/ServerError";
import { checkLoggedIn } from "../../../../services/authentication/checkLoggedIn.server";
import { deleteOneBlogMetaTag } from "../../../../services/blog-meta-tag/blogMetaTags.server";

export const action: ActionFunction = async ({ request, params }) => {
    await checkLoggedIn(request);

    if (!isDeleteRequest(request.method)) {
        return toErrorResponse(new MethodNotAllowedServerError());
    }

    const id = params.metaTagId;
    if (!id) {
        return toErrorResponse(new UnprocessableServerError());
    }

    await deleteOneBlogMetaTag(id);

    return null;
};
