import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import destyle from "destyle.css";
import color from "./styles/constants/_color.css";
import font from "./styles/constants/_font.css";
import style from "./styles/pages/root.css";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: destyle,
    },
    {
        rel: "stylesheet",
        href: color,
    },
    {
        rel: "stylesheet",
        href: font,
    },
    {
        rel: "stylesheet",
        href: style,
    },
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
