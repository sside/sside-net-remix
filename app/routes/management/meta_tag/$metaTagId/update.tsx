import { ActionFunction } from "@remix-run/node";
import { isPutRequest } from "../../../../constants/HttpMethodName";
import { MethodNotAllowedServerError, toErrorResponse, UnprocessableServerError } from "../../../../error/ServerError";
import { checkLoggedIn } from "../../../../services/authentication/checkLoggedIn.server";
import { updateBlogMetaTag } from "../../../../services/blog-meta-tag/blogMetaTags.server";
import { MetaTagRestResponse } from "../../../../types/api/metaTag/response/MetaTagRestResponse";

export class UpdateMetaTagRestRequest {
    constructor(readonly name: string) {}
}

export const action: ActionFunction = async ({ request, params }) => {
    await checkLoggedIn(request);

    if (!isPutRequest(request.method)) {
        return toErrorResponse(new MethodNotAllowedServerError());
    }

    const id = params.metaTagId;
    if (!id) {
        return toErrorResponse(new UnprocessableServerError());
    }

    const { name } = (await request.json()) as UpdateMetaTagRestRequest;

    return MetaTagRestResponse.fromEntity(await updateBlogMetaTag(id, name));
};
