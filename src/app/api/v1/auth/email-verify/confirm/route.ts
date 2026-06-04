import { NextRequest } from "next/server";
import { setErrResponse, setResponse } from "@/hooks/response";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return setErrResponse({
                status: 400,
                message: "invalid",
                err: { reason: "invalid" },
            });
        }

        const result = verifyOtp(String(email), String(code));

        if (result === "ok") {
            return setResponse({
                status: 200,
                message: "Email verified.",
                body: { verified: true },
            });
        }

     
        return setErrResponse({
            status: result === "too_many" ? 429 : 400,
            message: result,
            err: { reason: result },
        });
    } catch (err) {
        return setErrResponse({
            status: 500,
            message: "server_error",
            err,
        });
    }
}
