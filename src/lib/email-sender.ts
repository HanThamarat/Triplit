import { sendEmail } from "@better-auth/infra";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface SendEmailVerifyOTPProps {
    email: string;
    url: string;
    userName: string,
}

export const sendEmailSignUpVerifyOTP = async ({
    email,
    url,
    userName
}: SendEmailVerifyOTPProps) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);

    const result = await sendEmail({
        template: "verify-email",
        to: email,
        variables: {
            verificationUrl: url,
            verificationCode: String(randomCode),
            userEmail: email,
            userName: userName,
            appName: "Triplit",
            expirationMinutes: "10",
        }
    });

    if (!result.success) {
        console.error(
            `[email] verify-email send failed for ${email}: ${result.error}`
        );
    } else {
        console.info(`[email] verify-email sent to ${email}`);
    }

    return result;
}

export const emailTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});