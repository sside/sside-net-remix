import { Prisma, PrismaClient } from "@prisma/client";
import { Environment } from "../environment/Environment";

let prisma: PrismaClient;

declare global {
    var __prisma: PrismaClient | undefined;
}

// Get process.env
const environment = Environment.instance;

const productionPrismaClientLogLevels: Prisma.LogLevel[] = ["error", "warn"];
const developmentPrismaClientLogLevels: Prisma.LogLevel[] = [...productionPrismaClientLogLevels, "info", "query"];
const prismaClientOptions: Prisma.PrismaClientOptions = {
    log: environment.isProduction ? productionPrismaClientLogLevels : developmentPrismaClientLogLevels,
};

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (environment.isProduction) {
    prisma = new PrismaClient(prismaClientOptions);
} else {
    if (!global.__prisma) {
        global.__prisma = new PrismaClient();
    }
    prisma = global.__prisma;
}

export { prisma };
