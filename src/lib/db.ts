import "reflect-metadata";
import { DataSource} from "typeorm";
import dotenv from "dotenv";
import { Party } from "@/entities/party";
import { Party_Member } from "@/entities/party_member";
import { Party_Type } from "@/entities/party_type";

dotenv.config();
declare global {
    var typeormDS: DataSource | null | undefined;
}

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
    entities: [Party, Party_Member, Party_Type],
    migrations: ["src/migrations/**/*.ts"],
});

export async function getDatabaseConnection(): Promise<DataSource> {
    if (globalThis.typeormDS?.isInitialized) {
        return globalThis.typeormDS;
    }

    if (AppDataSource.isInitialized) {
        globalThis.typeormDS = AppDataSource;
        return globalThis.typeormDS;
    }

    try {
        globalThis.typeormDS = await AppDataSource.initialize();
        console.log("✅ Database connected");
        return globalThis.typeormDS;
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        throw err;
    }
};

