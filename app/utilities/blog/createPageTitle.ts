import { appConfig } from "../../../appConfig";

export const createPageTitle = (pageTitle: string) => `${pageTitle} | ${appConfig.global.siteName}`;
