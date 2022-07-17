import validator from "validator";
import { UnprocessableServerError } from "../../error/ServerError";
import isUUID = validator.isUUID;

interface PagingQuery {
    pointer: string;
    order: "asc" | "desc";
}

export const validatePagingQuery = (pointer?: string, order?: string): true | string => {
    const errorMessages: string[] = [];
    if (!pointer) {
        errorMessages.push(`pointer is not defined.`);
    }
    if (!order) {
        errorMessages.push(`order is not defined.`);
    }

    if (errorMessages.length) {
        return errorMessages.join(", ");
    }

    if (!isUUID(pointer!, 4)) {
        errorMessages.push(`pointer is not valid UUIDv4.`);
    }
    if (order !== "asc" && order !== "desc") {
        errorMessages.push(`order must be asc or desc.`);
    }

    return errorMessages.length ? errorMessages.join(", ") : true;
};

export const createPagingQuery = (pointer?: string, order?: string): PagingQuery => {
    const validateResult = validatePagingQuery(pointer, order);
    if (typeof validateResult === "string") {
        throw new UnprocessableServerError(validateResult);
    }

    return {
        pointer: pointer!,
        order: order as "asc" | "desc",
    };
};
