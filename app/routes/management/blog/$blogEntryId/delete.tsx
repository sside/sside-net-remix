import { LoaderFunction, redirect } from "@remix-run/node";
import { PathUrl } from "../../../../constants/paths/PathUrl";
import { toErrorResponse, UnprocessableServerError } from "../../../../error/ServerError";
import { checkLoggedIn } from "../../../../services/authentication/checkLoggedIn.server";
import { deleteOneBlogEntryById } from "../../../../services/blog/blogEntry.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    await checkLoggedIn(request);

    const id = params.blogEntryId;
    if (!id) {
        return toErrorResponse(new UnprocessableServerError());
    }

    await deleteOneBlogEntryById(id);

    return redirect(PathUrl.management.root);
};
