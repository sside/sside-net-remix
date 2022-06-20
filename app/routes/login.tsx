import type { ActionFunction } from "@remix-run/node";
import type { FC } from "react";
import {
    ADMINISTRATOR_AUTHENTICATION_STRATEGY_NAME,
    authenticator,
} from "../services/authentication/authentication.server";
import { AuthenticationInputName } from "../services/authentication/constants/AuthenticationInputName";

export const action: ActionFunction = async ({ request }) => {
    return await authenticator.authenticate(ADMINISTRATOR_AUTHENTICATION_STRATEGY_NAME, request, {
        successRedirect: "/admin",
        failureRedirect: "/login",
    });
};

const Login: FC = () => {
    const { UserId, Password } = AuthenticationInputName;
    return (
        <div className="loginForm">
            <h1 className="loginForm__title">EDITOR LOG IN</h1>
            <form className="loginForm__form" method="post">
                <label htmlFor={UserId} className="loginForm__form--label">
                    Email address
                </label>
                <input id={UserId} name={UserId} className="loginForm__form--input" type="text" required />
                <label htmlFor={Password} className="loginForm__form--label">
                    Password
                </label>
                <input
                    id={Password}
                    name={Password}
                    className="loginForm__form--input"
                    type="password"
                    autoComplete="current-password"
                    required
                />
                <button type="submit" className="loginForm__form--submit">
                    LOG IN
                </button>
            </form>
        </div>
    );
};

export default Login;
