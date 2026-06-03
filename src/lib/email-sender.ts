import { sendEmail } from "@better-auth/infra";

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