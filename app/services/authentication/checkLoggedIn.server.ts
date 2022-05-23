import { authenticator } from "~/services/authentication/authentication.server";

export const checkLoggedIn = async (request: Request, authenticationFailureRedirectPath?: string): Promise<void> => {
    await authenticator.isAuthenticated(request, { failureRedirect: authenticationFailureRedirectPath ?? "/login" });

    return;
};
