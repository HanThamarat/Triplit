import Input from "@/app/components/content-input/input";
import { useLanguage } from "@/i18n/LanguageProvider";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";

export default function SignIn() {

    const { t } = useLanguage();

    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signinWithGoogle = async () => {
        setError(null);
        setGoogleLoading(true);
        try {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
        // On success the browser is redirected by better-auth; no further work.
        } catch {
        setError(t("auth.googleError"));
        setGoogleLoading(false);
        }
    };

    // Email sign-in is presentational in this build (see CLAUDE.md); keep the
    // form semantics real but don't fake a result.
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };


    return(
        <div className="w-full">
            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <Input
                id="email"
                type="email"
                label={t("auth.email")}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
              />

              <Input
                id="password"
                isPassword
                label={t("auth.password")}
                placeholder={t("auth.passwordPlaceholder")}
                autoComplete="current-password"
                showPasswordLabel={t("auth.showPassword")}
                hidePasswordLabel={t("auth.hidePassword")}
              />

              <button
                type="submit"
                className="lp-focus group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset-deep px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("auth.signIn")}
                <FiArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[13px] text-ink-faint">{t("common.or")}</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              type="button"
              onClick={signinWithGoogle}
              disabled={googleLoading}
              className="lp-focus inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-line-strong bg-canvas px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-shell disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-line-strong border-t-ink" />
              ) : (
                <FcGoogle className="h-[20px] w-[20px]" />
              )}
              {t("auth.continueGoogle")}
            </button>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-sunset-wash px-4 py-3 text-[14px] font-medium text-sunset-deep">
                {error}
              </p>
            )}
        </div>
    );
}
