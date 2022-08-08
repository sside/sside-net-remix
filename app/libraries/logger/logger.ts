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
        this.pino.info(logObject, message);
    }

    debug(message: string, logObject?: LogObject): void {
        this.pino.debug(logObject, message);
    }

    warn(message: string, logObject?: LogObject): void {
        this.pino.warn(logObject, message);
    }

    error(message: string, logObject?: LogObject): void {
        this.pino.error(logObject, message);
    }
}
