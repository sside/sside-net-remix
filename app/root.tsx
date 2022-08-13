import type { ErrorBoundaryComponent, LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import destyle from "destyle.css";
import { ContentType } from "./constants/content-type/ContentType";
import { PathUrl } from "./constants/paths/PathUrl";
import { RootErrorBoundary, links as rootErrorBoundaryLinks } from "./RootErrorBoundary";
import color from "./styles/variables/_color.css";
import font from "./styles/variables/_font.css";
import layout from "./styles/variables/_layout.css";
import styles from "./styles/pages/root.css";
import { cssLinks } from "./utilities/styling/cssLinkDescriptor";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
});

export const ErrorBoundary: ErrorBoundaryComponent = RootErrorBoundary;

export const links: LinksFunction = () => [
    ...cssLinks(destyle, color, font, layout, styles),
    ...rootErrorBoundaryLinks(),
    { rel: "alternate", type: ContentType.Atom["Content-Type"], href: PathUrl.blog.feed.atom(), title: "Atom" },
];

export default function App() {
    return (
        <html lang="ja">
            <head>
                <Meta />
                <Links />
            </head>
            <body className={`app`}>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
