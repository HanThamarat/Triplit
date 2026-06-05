import { NextRequest } from "next/server";
import { setErrResponse, setResponse } from "@/hooks/response";
import { getDatabaseConnection } from "@/lib/db";
import { getVerifyType } from "@/@types/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();
        const db = await getDatabaseConnection();

        if (!email || !code) {
            return setErrResponse({
                status: 400,
                message: "invalid",
                err: { reason: "invalid" },
            });
        }

        const [getverify] = await db.query(`
            select v.identifier, v.value, v."expiresAt" from verification v 
            where v.identifier = $1 and v."expiresAt" > CURRENT_TIMESTAMP 
            order by v."createdAt" desc limit 1
        `, [email]) as getVerifyType[];
        
        if (!getverify) {
            return setErrResponse({
                status: 400,
                message: "expired",
                err: { reason: "expired" },
            });   
        }
    
        if (code !== getverify.value) {
            return setErrResponse({
                status: 400,
                message: "invalid",
                err: { reason: "invalid" },
            });
        }

        const [result] = await db.query(`
            update "user" u set "emailVerified" = true 
            where u.email = $1
        `, [email]);

        if (!result) throw "Have something worng, please try again later.";

        return setResponse({
            status: 200,
            message: "verify successfully.",
            body: { status: true },
        });
    } catch (err) {
        return setErrResponse({
            status: 500,
            message: "server_error",
            err,
        });
    }
}
