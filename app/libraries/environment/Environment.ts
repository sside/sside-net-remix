import { config } from "dotenv";

export class EnvironmentVariable {
    [key: string]: string;
    NODE_ENV = "";
    DATABASE_URL = "";
    ADMINISTRATOR_EMAIL_ADDRESS = "";
    ADMINISTRATOR_PASSWORD = "";
    SESSION_COOKIE_SECRET = "";
}

export class Environment {
    private static _instance: Environment;

    readonly isProduction: boolean;
    readonly isDevelopment: boolean;

    private readonly _variable: EnvironmentVariable;

    private constructor() {
        this._variable = this.getEnvironmentVariables();

        this.isProduction = this._variable.NODE_ENV === "production";
        this.isDevelopment = !this.isProduction;
    }

    static get instance(): Environment {
        if (!Environment._instance) {
            Environment._instance = new Environment();
        }
        return Environment._instance;
    }

    get variable(): EnvironmentVariable {
        return Environment.instance._variable;
    }

    private getEnvironmentVariables(isDebugDotEnv = false): EnvironmentVariable {
        config({
            debug: isDebugDotEnv,
        });

        const environmentVariable = new EnvironmentVariable();
        const unassignedKeys: string[] = [];
        for (const key of Object.keys(environmentVariable)) {
            if (!process.env[key]) {
                unassignedKeys.push(key);
            } else {
                environmentVariable[key] = process.env[key] as string;
            }
        }

        if (unassignedKeys.length > 0) {
            console.log(
                `[Environment] Required environment variables are unassigned. Keys: ${unassignedKeys.join(", ")}`,
            );
        }

        return environmentVariable;
    }
}
