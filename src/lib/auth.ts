import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";
import { dash } from "@better-auth/infra";
import { encryptPassword, verifyPassword } from "@/lib/passowrd-hashing";

dotenv.config();

export const auth = betterAuth({
    database: new Pool({
        host: process.env.DATABASE_HOST || "localhost",
        port: parseInt(process.env.DATABASE_PORT || "5432"),
        database: process.env.DATABASE_NAME || 'my_database',
        user: process.env.DATABASE_USERNAME || "root",
        password: process.env.DATABASE_PASSWORD || "root",
        // options: "-c search_path=auth",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        password: {
            hash: async (passowrd) => encryptPassword(passowrd),
            verify: async ({ password, hash }) => verifyPassword({ hash, password }),
        }  
    },
    plugins: [
        dash(),
    ]
});