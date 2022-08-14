import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { renderToString } from "react-dom/server";
import { appConfig } from "../appConfig";
import { prisma } from "./libraries/database/database";
import { Environment } from "./libraries/environment/Environment";

Sentry.init({
    dsn: appConfig.sentry.dsn,
    environment: Environment.instance.variable.NODE_ENV,
    tracesSampleRate: 1,
    integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
});

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    let markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

    responseHeaders.set("Content-Type", "text/html");

    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}
