export const HttpMethodName = {
    Get: "GET",
    Post: "POST",
    Put: "PUT",
    Delete: "DELETE",
};
export type HttpMethodName = typeof HttpMethodName[keyof typeof HttpMethodName];

const isRequiredMethod = (methodName: unknown, requiredMethod: HttpMethodName): boolean =>
    typeof methodName === "string" ? methodName.toUpperCase() === requiredMethod : false;

export const isGetRequest = (methodName: unknown): boolean => isRequiredMethod(methodName, HttpMethodName.Get);

export const isPostRequest = (methodName: unknown): boolean => isRequiredMethod(methodName, HttpMethodName.Post);

export const isPutRequest = (methodName: unknown): boolean => isRequiredMethod(methodName, HttpMethodName.Put);

export const isDeleteRequest = (methodName: unknown): boolean => isRequiredMethod(methodName, HttpMethodName.Delete);
