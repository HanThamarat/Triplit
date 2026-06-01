"use client";

import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import LanguageToggle from "@/app/components/LanguageToggle";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AuthPage() {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* ───────────────────────── STORY PANEL (desktop) ───────────────────────── */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-canvas-sink lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <Contours className="pointer-events-none absolute -right-28 -top-24 h-[440px] w-[440px] text-line-strong/45" />

        {/* Brand + back */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="lp-focus flex items-center gap-2.5" aria-label="Triplit home">
            <Logo size={32} className="!rounded-lg !shadow-none" />
            <span className="font-serif text-2xl leading-none text-ink">triplit</span>
          </Link>
          <Link
            href="/"
            className="lp-focus inline-flex items-center gap-1.5 rounded-full text-[14px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <FiArrowLeft className="h-4 w-4" />
            {t("auth.backHome")}
          </Link>
        </div>

        {/* Returning-trip glimpse */}
        <div className="relative z-10 my-10 max-w-md">
          <h2 className="auth-rise font-serif text-[clamp(2rem,3vw,2.7rem)] leading-[1.08] tracking-[-0.02em] text-ink [text-wrap:balance]">
            {t("auth.panelTitle")}
          </h2>

          <div className="auth-rise-2 mt-9">
            {/* Postcard trip card */}
            <div className="relative z-10 rotate-[-1.5deg] rounded-[1.5rem] border border-line bg-canvas p-5 lp-postcard sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t("landing.hero.cardDates")}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl leading-tight text-ink">
                    {t("landing.hero.cardTrip")}
                  </h3>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-meadow/12 px-3 py-1 text-xs font-semibold text-meadow-deep">
                  <FiCheck className="h-3.5 w-3.5" />
                  {t("landing.hero.cardStatus")}
                </span>
              </div>

              <RouteMap className="mt-5 w-full text-coast" />

              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {(["coral", "teal", "meadow", "ink"] as Tone[]).map((tone, i) => (
                    <span key={tone} className="rounded-full ring-2 ring-canvas">
                      <Avatar name={["Mei", "Ken", "Priya", "Sam"][i]} tone={tone} size={30} />
                    </span>
                  ))}
                </div>
                <span className="text-[13px] font-medium text-ink-faint">
                  {t("landing.trip.splitWays", { n: 4 })}
                </span>
              </div>
            </div>

            {/* Settlement glimpse */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3 lp-postcard">
              <Avatar name="Priya" tone="meadow" size={30} />
              <span className="text-sm font-medium text-ink">Priya</span>
              <FiArrowRight className="h-4 w-4 shrink-0 text-sunset-deep" />
              <Avatar name="Ken" tone="teal" size={30} />
              <span className="text-sm font-medium text-ink">Ken</span>
              <span className="ml-auto font-serif text-lg tabular-nums text-ink">$84</span>
            </div>

            <p className="mt-5 flex items-center gap-2 pl-1 font-hand text-2xl text-coast-deep">
              <FiCheck className="h-5 w-5" />
              {t("auth.panelSquare")}
            </p>
          </div>
        </div>

        <p className="relative z-10 text-sm text-ink-faint">
          © {new Date().getFullYear()} Triplit. {t("landing.footer.rights")}
        </p>
      </aside>

      {/* ───────────────────────── FORM COLUMN ───────────────────────── */}
      <div className="flex min-h-screen flex-col lg:min-h-0">
        {/* Top bar: brand+back on mobile, language toggle always */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-8 lg:justify-end lg:px-10 lg:py-6">
          <Link href="/" className="lp-focus flex items-center gap-2 lg:hidden" aria-label="Triplit home">
            <Logo size={30} className="!rounded-lg !shadow-none" />
            <span className="font-serif text-xl leading-none text-ink">triplit</span>
          </Link>
          <LanguageToggle />
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-2 sm:px-8 lg:px-10">
          <div className="auth-rise-3 w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="font-serif text-[clamp(2rem,4vw,2.6rem)] leading-tight tracking-[-0.02em] text-ink [text-wrap:balance]">
                {t("auth.welcome")}
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                {t("auth.subtitle")}
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <Field
                id="email"
                type="email"
                label={t("auth.email")}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
                value={email}
                onChange={setEmail}
              />

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[13px] font-semibold text-ink"
                >
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-line-strong bg-canvas px-4 py-3 pr-11 text-[15px] text-ink transition-colors placeholder:text-ink-faint focus:border-coast-deep focus:outline-none focus:ring-2 focus:ring-coast/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    className="lp-focus absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-faint transition-colors hover:text-ink"
                  >
                    {showPassword ? <FiEyeOff className="h-[18px] w-[18px]" /> : <FiEye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

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
        </div>
      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Local helpers (Sunset Coast vocabulary, shared with the landing)
   ════════════════════════════════════════════════════════════════════ */

type Tone = "coral" | "teal" | "meadow" | "ink";

const AVATAR_TONE: Record<Tone, string> = {
  coral: "bg-sunset text-white",
  teal: "bg-coast text-white",
  meadow: "bg-meadow text-white",
  ink: "bg-ink text-canvas",
};

function Avatar({ name, tone, size = 30 }: { name: string; tone: Tone; size?: number }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full font-semibold ${AVATAR_TONE[tone]}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  );
}

function Field({
  id,
  type,
  label,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line-strong bg-canvas px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-ink-faint focus:border-coast-deep focus:outline-none focus:ring-2 focus:ring-coast/30"
      />
    </div>
  );
}

function RouteMap({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 120" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 92 C 70 96, 78 40, 120 44 S 196 86, 230 40 264 28 264 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      {[
        { x: 16, y: 92 },
        { x: 120, y: 44 },
        { x: 230, y: 40 },
        { x: 264, y: 28 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === 3 ? 7 : 5} fill="currentColor" />
          <circle cx={p.x} cy={p.y} r={i === 3 ? 3 : 2} fill="var(--color-canvas)" />
        </g>
      ))}
      <path d="M250 18 l10 6 -10 6 2 -6 z" fill="var(--color-sunset)" transform="rotate(18 255 24)" />
    </svg>
  );
}

function Contours({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden="true">
      {[150, 120, 90, 60, 32].map((r, i) => (
        <path
          key={r}
          d={`M${200 - r} 200 a${r} ${r * 0.78} 0 1 0 ${r * 2} 0 a${r} ${r * 0.78} 0 1 0 ${-r * 2} 0`}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={0.5 - i * 0.06}
        />
      ))}
    </svg>
  );
}
