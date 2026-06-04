import { NextRequest } from "next/server";
import { setErrResponse, setResponse } from "@/hooks/response";
import { emailTransport } from "@/lib/email-sender";
import { getDatabaseConnection } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const FROM = process.env.SMTP_USER || "no-reply@triplit.app";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const db = await getDatabaseConnection();

        if (!email || typeof email !== "string") {
            return setErrResponse({
                status: 400,
                message: "Email is required.",
                err: { reason: "email_required" },
            });
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        const genNewuuid = uuidv4();
        const date = dayjs().add(10, "minute").toISOString();


        const [verifyData] = await db.query(`
            insert into verification (id, identifier, value, "expiresAt")
            values ($1, $2, $3, $4)
            returning *
        `,
        [genNewuuid, email, String(code), date]);

        console.log(verifyData);

        await emailTransport.sendMail({
            from: `Triplit <${FROM}>`,
            to: email,
            subject: `${code} is your Triplit verification code`,
            text: `Your Triplit verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
            html: `
                <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:440px;margin:0 auto;padding:32px 24px;color:#3a302a">
                    <p style="margin:0 0 8px;font-size:15px;color:#6b5f57">Triplit</p>
                    <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#3a302a">Verify your email</h1>
                    <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#6b5f57">Enter this code to finish setting up your account. It expires in 10 minutes.</p>
                    <p style="margin:0 0 24px;font-size:34px;font-weight:700;letter-spacing:8px;color:#b4502e">${code}</p>
                    <p style="margin:0;font-size:13px;line-height:1.5;color:#9a8d84">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        return setResponse({
            status: 200,
            message: "Verification code sent.",
            body: { sent: true },
        });
    } catch (err) {
        return setErrResponse({
            status: 500,
            message: "Couldn't send the verification code.",
            err,
        });
    }
}
