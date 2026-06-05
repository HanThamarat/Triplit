import { NextRequest } from "next/server";
import { setErrResponse, setResponse } from "@/hooks/response";
import { getDatabaseConnection } from "@/lib/db";

interface UserRow {
    email: string;
    emailVerified: boolean;
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return setErrResponse({
                status: 400,
                message: "Email is required.",
                err: { reason: "email_required" },
            });
        }

        const db = await getDatabaseConnection();

        // Raw lookup against better-auth's user table (no better-auth API here).
        const [user] = await db.query(`
            select u.email, u."emailVerified" from "user" u
            where u.email = $1 limit 1
        `, [email]) as UserRow[];

        const exists = Boolean(user);
        const verified = exists && user.emailVerified === true;
        // A verified account already owns this email. An unverified row means a
        // half-finished sign-up, so the email is still free to continue with.
        const available = !verified;

        return setResponse({
            status: 200,
            message: "ok",
            body: { exists, verified, available },
        });
    } catch (err) {
        return setErrResponse({
            status: 500,
            message: "server_error",
            err,
        });
    }
}
