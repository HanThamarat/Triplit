import "reflect-metadata";
import { DataSource} from "typeorm";
import { Users } from "@/entities/user";
import dotenv from "dotenv";

dotenv.config();

globalThis.typeormDS = globalThis.typeormDS || null;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    database: process.env.DATABASE_NAME || 'my_database',
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "root",
    synchronize: process.env.NODE_ENV !== "production",
    logging: true,
    entities: [Users],
    subscribers: [],
    migrations: [],
});

export async function getDatabaseConnection(): Promise<DataSource> {
    if (globalThis.typeormDS?.isInitialized) {
        return globalThis.typeormDS;
    }

    globalThis.typeormDS = await AppDataSource.initialize();
    return globalThis.typeormDS;
};

