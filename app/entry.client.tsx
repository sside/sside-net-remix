import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { useEffect } from "react";
import { hydrate } from "react-dom";
import * as Sentry from "@sentry/remix";
import { appConfig } from "../appConfig";

Sentry.init({
    dsn: appConfig.sentry.dsn,
    tracesSampleRate: 1,
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.remixRouterInstrumentation(useEffect, useLocation, useMatches),
        }),
    ],
});

hydrate(<RemixBrowser />, document);
