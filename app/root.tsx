import type { ErrorBoundaryComponent, LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react";
import { CatchBoundaryComponent } from "@remix-run/react/dist/routeModules";
import destyle from "destyle.css";
import { ErrorPage, links as errorPageLinks } from "./components/error/ErrorPage";
import { ContentType } from "./constants/content-type/ContentType";
import { PathUrl } from "./constants/paths/PathUrl";
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
    const { message, stack } = error;
    return <ErrorPage statusCode={500} errorMessage={message} stackTrace={stack} />;
};

export const CatchBoundary: CatchBoundaryComponent = () => {
    const { status, statusText, data } = useCatch();
    return <ErrorPage errorMessage={(data || statusText) as string} statusCode={status} />;
};

export const links: LinksFunction = () => [
    ...cssLinks(destyle, color, font, layout, styles),
    ...errorPageLinks(),
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
