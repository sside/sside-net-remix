import { ErrorBoundaryComponent } from "@remix-run/node";
import { Link, Links, Meta } from "@remix-run/react";

export const RootErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
    return (
        <html>
            <head>
                <title>{error.name}</title>
                <Meta />
                <Links />
            </head>
            <body>
                <h1>{error.name}</h1>
                <Link to={"/"}>Go to root</Link>
                <main>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </main>
            </body>
        </html>
    );
};
