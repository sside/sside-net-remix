import { Response } from "@remix-run/node";
import { StatusCodes } from "http-status-codes";

export class ServerError extends Error {
    constructor(public readonly code: StatusCodes, message?: string) {
        super(`${code}: ` + (message || ""));
    }
}

export class InternalServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
}

export class NotFoundServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.NOT_FOUND, message);
    }
}

export class ForbiddenServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.FORBIDDEN, message);
    }
}

export class UnprocessableServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, message);
    }
}

export class ConflictServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.CONFLICT, message);
    }
}

export class BadRequestServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }
}

export class MethodNotAllowedServerError extends ServerError {
    constructor(message?: string) {
        super(StatusCodes.METHOD_NOT_ALLOWED, message);
    }
}

export const toErrorResponse = (error: ServerError): Response => {
    const { message, code } = error;
    return new Response(message, {
        status: code,
    });
};
