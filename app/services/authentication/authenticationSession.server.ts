import { createCookieSessionStorage } from "@remix-run/node";
import { Environment } from "../../libraries/environment/Environment";
import { appConfig } from "../../../appConfig";

const environment = Environment.instance;

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [environment.variable.SESSION_COOKIE_SECRET],
        secure: environment.isProduction,
        maxAge: 60 * 60 * 24 * appConfig.auth.sessionExpireDay,
    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
