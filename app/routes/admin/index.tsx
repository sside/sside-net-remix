import { LoaderFunction } from "@remix-run/node";
import { FC } from "react";
import { checkLoggedIn } from "~/services/authentication/checkLoggedIn.server";

export const loader: LoaderFunction = async ({ request }) => {
    await checkLoggedIn(request, "/");
    return null;
};

const Admin: FC = () => {
    return <h1>admin</h1>;
};

export default Admin;
