import { LinksFunction } from "@remix-run/node";
import { Link, Links, Meta } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../constants/paths/PathUrl";
import { Environment } from "../../libraries/environment/Environment";
import { createPageTitle } from "../../utilities/blog/createPageTitle";
import { cssLinks } from "../../utilities/styling/cssLinkDescriptor";
import styles from "./ErrorPage.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    statusCode: number;
    errorMessage?: string;
    stackTrace?: string;
}

export const ErrorPage: FC<Props> = ({ errorMessage, statusCode, stackTrace }) => {
    return (
        <html>
            <head>
                <title>{createPageTitle(`${statusCode}: ${errorMessage}`)}</title>
                <Meta />
                <Links />
            </head>
            <body className={`rootErrorBoundary`}>
                <h1 className={`rootErrorBoundary__header`}>Error occurred.</h1>

                <main className={`rootErrorBoundary__body`}>
                    <span className={`rootErrorBoundary__message`}>{`${statusCode}: ${errorMessage}`}</span>
                    {Environment.instance.isDevelopment && stackTrace && (
                        <pre className={`rootErrorBoundary__stackTrace`}>{stackTrace}</pre>
                    )}
                </main>
                <Link to={PathUrl.blog.root} className={`rootErrorBoundary__linkToRoot`}>
                    Go to root
                </Link>
            </body>
        </html>
    );
};
