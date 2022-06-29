import { LoaderFunction, redirect } from "@remix-run/node";
import { PathUrl } from "../constants/paths/PathUrl";

export const loader: LoaderFunction = async () => {
    return redirect(PathUrl.blog.root);
};
