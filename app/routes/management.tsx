import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FC } from "react";
import styles from "../styles/pages/management.css";
import { cssLinks } from "../utilities/styling/cssDescription";

export const links: LinksFunction = () => cssLinks(styles);

const Management: FC = () => {
    return (
        <main className="management">
            <Outlet />
        </main>
    );
};

export default Management;
