import z from "zod";

// Password policy. Messages are i18n dot-paths resolved with t() at render time
// (see auth.validation.* in src/i18n). The same keys drive the live requirement
// checklist in the sign-up form, so each rule reads as a positive requirement.
const passwordPolicy = z
    .string()
    .min(8, "auth.validation.passwordMin")
    .max(72, "auth.validation.passwordMax") // scrypt/bcrypt practical input ceiling
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
