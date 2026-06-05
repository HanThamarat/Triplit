import z from "zod";

const passwordPolicy = z
    .string()
    .min(8, "auth.validation.passwordMin")
    .max(72, "auth.validation.passwordMax")
    .regex(/[a-z]/, "auth.validation.passwordLower")
    .regex(/[A-Z]/, "auth.validation.passwordUpper")
    .regex(/[0-9]/, "auth.validation.passwordNumber")
    .regex(/[^A-Za-z0-9]/, "auth.validation.passwordSymbol");

export const signUpSchema = z
    .object({
        name: z.string().trim().min(1, "auth.validation.nameRequired"),
        email: z.string().email("auth.validation.email"),
        password: passwordPolicy,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "auth.validation.passwordMatch",
        path: ["confirmPassword"],
    });

export type signUpType = z.infer<typeof signUpSchema>;

export interface getVerifyType {
    identifier: string;
    value: string;
    expiresAt: string;
}

export interface sendEmailVerifyResponse {
    sent: boolean;
}

export interface confirmEmailVerifyResponse {
    status: true
}

export interface checkEmailResponse {
    /** A row exists in the user table for this email. */
    exists: boolean;
    /** The existing row is email-verified (account already taken). */
    verified: boolean;
    /** Free to sign up with — true unless a verified account owns it. */
    available: boolean;
}
