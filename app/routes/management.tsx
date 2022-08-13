import { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FC, Fragment } from "react";
import { links as theManagementMenuLinks, TheManagementMenu } from "../components/management/common/TheManagementMenu";
import { checkLoggedIn } from "../services/authentication/checkLoggedIn.server";
import styles from "../styles/pages/management/managementOutlet.css";
import { createPageTitle } from "../utilities/blog/createPageTitle";
import { cssLinkDescriptor } from "../utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => [cssLinkDescriptor(styles), ...theManagementMenuLinks()];

export const loader: LoaderFunction = async ({ request }) => {
    await checkLoggedIn(request);
    return null;
};

export const meta: MetaFunction = () => ({
    title: createPageTitle(`management`),
});

const Management: FC = () => {
    return (
        <Fragment>
            <TheManagementMenu />
            <main className="managementOutlet">
                <Outlet />
            </main>
        </Fragment>
    );
};

export default Management;
