import { HttpMethodName } from "../../constants/HttpMethodName";

const apiClient = async <T>(url: string, method: HttpMethodName, body?: object) => {
    const init: RequestInit = {
        method,
        mode: "same-origin",
        credentials: "same-origin",
        body: body ? JSON.stringify(body) : undefined,
    };
    const response = await fetch(url, init);

    const { ok, status, json, url: requestUrl, body: responseBody, bodyUsed } = response;
    if (!ok) {
        throw new Error(
            `[${
                apiClient.name
            }]: APIコール時にエラーが発生しました。Status: ${status}, Response: ${responseBody?.toString()}, URL: ${requestUrl}`,
        );
    }
    console.log({ bodyUsed });
    return bodyUsed ? ((await json()) as T) : null;
};

export const getClient = async <T>(url: string): Promise<T | null> => await apiClient(url, "GET");

export const postClient = async <T>(url: string, body: object): Promise<T | null> => await apiClient(url, "POST", body);

export const putClient = async <T>(url: string, body: object): Promise<T | null> => await apiClient(url, "PUT", body);

export const deleteClient = async (url: string, body?: object): Promise<null> => await apiClient(url, "DELETE", body);
