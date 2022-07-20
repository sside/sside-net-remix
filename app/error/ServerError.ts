import { Response } from "@remix-run/node";
import { StatusCodes } from "http-status-codes";
import { Nullable, Primitive } from "../types/utility/utility-type";

interface ErrorContextValues {
    [key: string]: Primitive | Nullable;
}

export class ServerError extends Error {
    constructor(public readonly code: StatusCodes, message?: string, values?: ErrorContextValues) {
        const valueMessages: string[] = [];
        if (values) {
            for (const [key, value] of Object.entries(values)) {
                valueMessages.push(`${key}: ${value}`);
            }
        }
        let errorMessage = message || "";
        if (valueMessages.length) {
            errorMessage += " " + valueMessages.join(", ");
        }

        super(`${code}: ` + errorMessage);
    }
}

export class InternalServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message, values);
    }
}

export class NotFoundServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.NOT_FOUND, message, values);
    }
}

export class ForbiddenServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.FORBIDDEN, message, values);
    }
}

export class UnprocessableServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, message, values);
    }
}

export class ConflictServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.CONFLICT, message, values);
    }
}

export class BadRequestServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.BAD_REQUEST, message, values);
    }
}

export class MethodNotAllowedServerError extends ServerError {
    constructor(message?: string, values?: ErrorContextValues) {
        super(StatusCodes.METHOD_NOT_ALLOWED, message, values);
    }
}

export const toErrorResponse = (error: ServerError): Response => {
    const { message, code } = error;
    return new Response(message, {
        status: code,
    });
};
