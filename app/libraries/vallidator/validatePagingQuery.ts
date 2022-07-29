import validator from "validator";
import { QuerySortOrder } from "../../types/database/QuerySortOrder";
import { Nullable } from "../../types/utility/utility-type";
import isUUID = validator.isUUID;

export const validatePagingQuery = (
    pointer: string | Nullable,
    order: string | Nullable,
    count: string | Nullable,
): true | string => {
    const errorMessages: string[] = [];
    if (!pointer) {
        errorMessages.push(`"pointer"が未定義です。`);
    }
    if (!order) {
        errorMessages.push(`"order"が未定義です。`);
    }
    if (!count) {
        errorMessages.push(`"count"が未定義です。`);
    }

    if (errorMessages.length) {
        return errorMessages.join(", ");
    }

    if (!isUUID(pointer!, 4)) {
        errorMessages.push(`"pointer"がUUIDv4フォーマットではありません。`);
    }
    const orderValues = Object.values(QuerySortOrder);
    if (!orderValues.includes(order as QuerySortOrder)) {
        errorMessages.push(
            `"order"が${Object.values(QuerySortOrder)
                .map((value) => `"${value}"`)
                .join(", ")}のいずれでもありません。`,
        );
    }
    if (isNaN(parseInt(count!, 10))) {
        errorMessages.push(`"count"が整数ではありません。`);
    }

    return errorMessages.length ? errorMessages.join(", ") : true;
};
