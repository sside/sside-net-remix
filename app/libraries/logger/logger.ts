import pino, { Logger as PinoLogger } from "pino";

type LogObject = { [key: string]: unknown };

export class Logger {
    private readonly pino: PinoLogger;

    constructor(contextName: string) {
        this.pino = pino({
            name: contextName,
        });
    }

    log(message: string, logObject?: LogObject): void {
        this.pino.info(message, { ...logObject });
    }

    debug(message: string, logObject?: LogObject): void {
        this.pino.debug(message, { ...logObject });
    }

    warn(message: string, logObject?: LogObject): void {
        this.pino.warn(message, { ...logObject });
    }

    error(message: string, logObject?: LogObject): void {
        this.pino.error(message, { ...logObject });
    }
}
