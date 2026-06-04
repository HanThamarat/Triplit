import { signUpSchema, signUpType } from "@/@types/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/i18n/LanguageProvider";
import { authClient } from "@/lib/auth-client";
import Input from "@/app/components/content-input/input";
import OtpVerify from "./otp-verify";

// Mirrors src/@types/auth.ts passwordPolicy. Each rule reads as a positive
// requirement, so the same list powers the live checklist below the field.
const PASSWORD_RULES = [
    { key: "auth.validation.passwordMin", test: (p: string) => p.length >= 8 },
    { key: "auth.validation.passwordLower", test: (p: string) => /[a-z]/.test(p) },
    { key: "auth.validation.passwordUpper", test: (p: string) => /[A-Z]/.test(p) },
    { key: "auth.validation.passwordNumber", test: (p: string) => /[0-9]/.test(p) },
    { key: "auth.validation.passwordSymbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export default function SignUp() {
    const { t } = useLanguage();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<signUpType>({
        resolver: zodResolver(signUpSchema),
        mode: "onTouched",
    });

    const [serverError, setServerError] = useState<string | null>(null);
    const [sentTo, setSentTo] = useState<string | null>(null);

    const password = watch("password") ?? "";

    const onSubmit: SubmitHandler<signUpType> = async (values) => {
        setServerError(null);
        const { data, error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        });

        console.log(data, error);

        if (error) {
            setServerError(t("auth.signUpError"));
            return;
        }

        setSentTo(values.email);
    };

    if (sentTo) {
        return (
            <OtpVerify
                email={sentTo}
                purpose="email-verification"
                onChangeEmail={() => setSentTo(null)}
            />
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                <Input
                    id="name"
                    label={t("auth.userName")}
                    placeholder={t("auth.userNamePlaceholder")}
                    autoComplete="name"
                    error={errors.name ? t(errors.name.message!) : undefined}
                    {...register("name")}
                />

                <Input
                    id="email"
                    type="email"
                    label={t("auth.email")}
                    placeholder={t("auth.emailPlaceholder")}
                    autoComplete="email"
                    error={errors.email ? t(errors.email.message!) : undefined}
                    {...register("email")}
                />

                <div className="flex flex-col gap-2.5">
                    <Input
                        id="password"
                        isPassword
                        label={t("auth.password")}
                        placeholder={t("auth.passwordPlaceholder")}
                        autoComplete="new-password"
                        showPasswordLabel={t("auth.showPassword")}
                        hidePasswordLabel={t("auth.hidePassword")}
                        aria-describedby="password-requirements"
                        aria-invalid={errors.password ? true : undefined}
                        {...register("password")}
                    />

                    <div className="p-[10px] bg-[#f7f4f0] border-[#F3ECE2] border rounded-[10px]">
                        <ul
                            id="password-requirements"
                            className="flex flex-col gap-1.5"
                            aria-label={t("auth.passwordRequirements")}
                        >
                            {PASSWORD_RULES.map((rule) => {
                                const met = rule.test(password);
                                const flagged = !met && isSubmitted;
                                return (
                                    <li
                                        key={rule.key}
                                        className={`flex items-center gap-2 text-[13px] transition-colors ${
                                            met
                                                ? "text-meadow-deep"
                                                : flagged
                                                ? "text-sunset-ink"
                                                : "text-ink-faint"
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors ${
                                                met
                                                    ? "bg-meadow/15 text-meadow-deep"
                                                    : flagged
                                                    ? "bg-sunset-wash text-sunset-ink"
                                                    : "bg-shell text-ink-faint"
                                            }`}
                                        >
                                            {met ? (
                                                <FiCheck className="h-3 w-3" strokeWidth={3} />
                                            ) : (
                                                <span className="h-1 w-1 rounded-full bg-current" />
                                            )}
                                        </span>
                                        <span>{t(rule.key)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    </div>
                <Input
                    id="passwordConfirm"
                    isPassword
                    label={t("auth.passwordConfirm")}
                    placeholder={t("auth.passwordConfirmPlaceholder")}
                    autoComplete="new-password"
                    showPasswordLabel={t("auth.showPassword")}
                    hidePasswordLabel={t("auth.hidePassword")}
                    error={errors.confirmPassword ? t(errors.confirmPassword.message!) : undefined}
                    {...register("confirmPassword")}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="lp-focus group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset-deep px-6 py-3.5 text-[15px] font-semibold text-white transition-[transform,opacity] hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                        <>
                            {t("auth.createAccount")}
                            <FiArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>

                {serverError && (
                    <p
                        role="alert"
                        className="rounded-xl bg-sunset-wash px-4 py-3 text-[14px] font-medium text-sunset-deep"
                    >
                        {serverError}
                    </p>
                )}
            </form>
        </div>
    );
}
