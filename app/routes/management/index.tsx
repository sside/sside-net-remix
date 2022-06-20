import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { FC } from "react";
import { checkLoggedIn } from "../../services/authentication/checkLoggedIn.server";
import styles from "../../styles/pages/management.css";
import { cssLinks } from "../../utilities/styling/cssDescription";

export const links: LinksFunction = () => cssLinks(styles);

export const loader: LoaderFunction = async ({ request }) => {
    await checkLoggedIn(request, "/");
    return null;
};

const Admin: FC = () => {
    return (
        <main className="management">
            <h1>management menu</h1>
            <section className="management__blog">
                <h2>blog posts</h2>
            </section>
        </main>
    );
};

export default Admin;
