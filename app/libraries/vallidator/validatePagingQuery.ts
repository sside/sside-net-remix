import validator from "validator";
import { Nullable } from "../../types/utility/utility-type";
import isUUID = validator.isUUID;

export const validatePagingQuery = (
    pointer: string | Nullable,
    order: string | Nullable,
    count: string | Nullable,
): true | string => {
    const errorMessages: string[] = [];
    if (!pointer) {
        errorMessages.push(`pointer is not defined.`);
    }
    if (!order) {
        errorMessages.push(`order is not defined.`);
    }
    if (!count) {
        errorMessages.push(`count is not defied.`);
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
    if (isNaN(parseInt(count!, 10))) {
        errorMessages.push(`count must be integer.`);
    }

    return errorMessages.length ? errorMessages.join(", ") : true;
};
