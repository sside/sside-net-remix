import { ErrorBoundaryComponent, LinksFunction } from "@remix-run/node";
import { Link, Links, Meta } from "@remix-run/react";
import { PathUrl } from "./constants/paths/PathUrl";
import { Environment } from "./libraries/environment/Environment";
import styles from "./styles/error/RootErrorBoundary.css";
import { cssLinks } from "./utilities/styling/cssLinkDescriptor";

export const links: LinksFunction = () => cssLinks(styles);

export const RootErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
    const { message, stack } = error;

    return (
        <html>
            <head>
                <title>{`sside.net: ${message}`}</title>
                <Meta />
                <Links />
            </head>
            <body className={`rootErrorBoundary`}>
                <h1 className={`rootErrorBoundary__header`}>Error occurred.</h1>

                <main className={`rootErrorBoundary__body`}>
                    <span className={`rootErrorBoundary__message`}>{message}</span>
                    {Environment.instance.isDevelopment && (
                        <pre className={`rootErrorBoundary__stackTrace`}>{stack}</pre>
                    )}
                </main>
                <Link to={PathUrl.public.blogRoot} className={`rootErrorBoundary__linkToRoot`}>
                    Go to root
                </Link>
            </body>
        </html>
    );
};
