"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiRefreshCw } from "react-icons/fi";
import { useLanguage } from "@/i18n/LanguageProvider";
import OtpInput from "@/app/components/content-input/otp-input";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;
const SEND_URL = "/api/v1/auth/email-verify";
const CONFIRM_URL = "/api/v1/auth/email-verify/confirm";

type Purpose = "email-verification" | "sign-in";
type Status = "idle" | "verifying" | "error" | "success";
type ErrorKey = "errorInvalid" | "errorExpired" | "errorGeneric";

interface OtpVerifyProps {
    email: string;
    /** Drives the heading/CTA/success copy only; both paths hit the same API. */
    purpose?: Purpose;
    /** Step back to edit the email. */
    onChangeEmail?: () => void;
    /** Override the post-verify action (default: navigate to /dashboard). */
    onVerified?: () => void;
}

async function postJson(url: string, body: unknown) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data } as { ok: boolean; data: { message?: string } };
}

/**
 * Code-entry screen for the custom email-verification flow. Sends a code on
 * mount (the caller just supplies the email), auto-verifies when all six digits
 * land, and resends on a 30s cooldown. All network goes through the project's
 * /api/v1/auth/email-verify routes — no better-auth.
 */
export default function OtpVerify({
    email,
    purpose = "email-verification",
    onChangeEmail,
    onVerified,
}: OtpVerifyProps) {
    const { t } = useLanguage();
    const router = useRouter();

    const [code, setCode] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
    const [shaking, setShaking] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

    // Latch the auto-submit so one full entry triggers a single verify attempt.
    const verifyingRef = useRef(false);
    // Send exactly one code on mount, even under React's dev double-invoke.
    const sentOnMount = useRef(false);

    useEffect(() => {
        if (sentOnMount.current) return;
        sentOnMount.current = true;
        void sendCode(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = window.setInterval(() => {
            setCooldown((s) => (s <= 1 ? 0 : s - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [cooldown]);

    const showError = (key: ErrorKey) => {
        setStatus("error");
        setErrorKey(key);
        setShaking(true);
        setCode("");
    };

    async function sendCode(isResend: boolean) {
        if (isResend) setResendState("sending");
        setErrorKey(null);
        try {
            const { ok } = await postJson(SEND_URL, { email });
            if (!ok) throw new Error("send_failed");
            setCooldown(RESEND_COOLDOWN);
            if (isResend) {
                setCode("");
                setStatus("idle");
                setResendState("sent");
                window.setTimeout(() => setResendState("idle"), 2500);
            }
        } catch {
            setCooldown(0); // let them retry immediately
            setResendState("idle");
            setErrorKey("errorGeneric");
        }
    }

    const verify = async (value: string) => {
        if (value.length !== OTP_LENGTH || verifyingRef.current) return;
        verifyingRef.current = true;
        setStatus("verifying");
        setErrorKey(null);
        try {
            const { ok, data } = await postJson(CONFIRM_URL, { email, code: value });
            if (!ok) {
                const reason = data?.message ?? "";
                if (reason === "expired") showError("errorExpired");
                else if (reason === "invalid") showError("errorInvalid");
                else showError("errorGeneric");
                return;
            }
            setStatus("success");
            window.setTimeout(() => {
                if (onVerified) onVerified();
                else router.push("/dashboard");
            }, 900);
        } catch {
            showError("errorGeneric");
        } finally {
            verifyingRef.current = false;
        }
    };

    const resend = () => {
        if (cooldown > 0 || resendState === "sending" || status === "success") return;
        void sendCode(true);
    };

    const cta = purpose === "sign-in" ? t("auth.otp.signInCta") : t("auth.otp.verify");

    // ── Success ────────────────────────────────────────────────────────────
    if (status === "success") {
        return (
            <div className="w-full" role="status" aria-live="polite">
                <div className="otp-pop flex flex-col items-center gap-4 rounded-2xl border border-line bg-canvas-sink px-6 py-9 text-center">
                    <span className="grid h-13 w-13 place-items-center rounded-full bg-meadow/15 text-meadow-deep">
                        <FiCheck className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <h2 className="font-serif text-xl text-ink">
                        {purpose === "sign-in" ? t("auth.otp.successSignIn") : t("auth.otp.successVerify")}
                    </h2>
                    <p className="text-[14px] text-ink-soft">{t("auth.otp.successNote")}</p>
                </div>
            </div>
        );
    }

    // ── Entry ──────────────────────────────────────────────────────────────
    return (
        <div className="w-full">
            {onChangeEmail && (
                <button
                    type="button"
                    onClick={onChangeEmail}
                    className="lp-focus -ml-1 mb-5 inline-flex items-center gap-1.5 rounded-full px-1 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    {t("auth.otp.changeEmail")}
                </button>
            )}

            <h1 className="font-serif text-[clamp(1.75rem,3.5vw,2.3rem)] leading-tight tracking-[-0.02em] text-ink [text-wrap:balance]">
                {t("auth.otp.title")}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                {t("auth.otp.subtitle", { email })}
            </p>

            <div className="mt-7">
                <div
                    className={shaking ? "otp-shake" : undefined}
                    onAnimationEnd={() => setShaking(false)}
                >
                    <OtpInput
                        value={code}
                        onChange={(next) => {
                            setCode(next);
                            if (status === "error") {
                                setStatus("idle");
                                setErrorKey(null);
                            }
                        }}
                        onComplete={verify}
                        length={OTP_LENGTH}
                        status={status === "error" ? "error" : "idle"}
                        disabled={status === "verifying"}
                        autoFocus
                        groupLabel={t("auth.otp.codeLabel")}
                        digitLabel={t("auth.otp.digit")}
                    />
                </div>

                <p
                    role="alert"
                    aria-live="assertive"
                    className={`mt-3 min-h-[20px] text-[13px] font-medium text-sunset-ink transition-opacity ${
                        errorKey ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {errorKey ? t(`auth.otp.${errorKey}`) : " "}
                </p>
            </div>

            <button
                type="button"
                onClick={() => verify(code)}
                disabled={code.length !== OTP_LENGTH || status === "verifying"}
                className="lp-focus group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset-deep px-6 py-3.5 text-[15px] font-semibold text-white transition-[transform,opacity] hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {status === "verifying" ? (
                    <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                    cta
                )}
            </button>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px]">
                <span className="text-ink-faint">{t("auth.otp.didntGet")}</span>
                {cooldown > 0 ? (
                    <span className="font-medium text-ink-faint tabular-nums">
                        {t("auth.otp.resendIn", { seconds: cooldown })}
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={resend}
                        disabled={resendState === "sending"}
                        className="lp-focus inline-flex items-center gap-1.5 rounded-full font-semibold text-coast-deep underline-offset-4 transition-colors hover:underline disabled:no-underline disabled:opacity-60"
                    >
                        {resendState === "sending" ? (
                            <>
                                <FiRefreshCw className="h-3.5 w-3.5 animate-spin" />
                                {t("auth.otp.resending")}
                            </>
                        ) : resendState === "sent" ? (
                            <span className="inline-flex items-center gap-1.5 text-meadow-deep">
                                <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />
                                {t("auth.otp.resent")}
                            </span>
                        ) : (
                            t("auth.otp.resend")
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
