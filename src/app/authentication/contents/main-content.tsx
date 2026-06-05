"use client";

import { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import LanguageToggle from "@/app/components/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageProvider";
import SignIn from "../contents/signIn";
import SignUp from "../contents/signUp";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import createQueryString from "@/hooks/searchParams";

export default function AuthMain() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const pageState = searchParams.get("state");
  
  const [state, setState] = useState<"signin" | "signup">(() => pageState === "signup" ? "signup" : "signin");
  const [otpShowing, setOtpShowing] = useState(false);

  useEffect(() => {
    if (!pageState) {
      router.push(path + "?" + createQueryString({ name: "state", value: "signin" })); 
    }
  }, [pageState]);


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
            {!otpShowing && (
              <>
                <div className="mb-8">
                  <h1 className="font-serif text-[clamp(2rem,4vw,2.6rem)] leading-tight tracking-[-0.02em] text-ink [text-wrap:balance]">
                    {t("auth.welcome")}
                  </h1>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                    {t("auth.subtitle")}
                  </p>
                </div>

                <div className=" duration-100 ease-in w-full bg-[#F8F2EB] p-[5px] mb-2.5 rounded-full flex justify-center gap-[5px]">
                    <button onClick={() => {
                      router.push(path + "?" + createQueryString({ name: "state", value: "signin" }));
                      setState("signin");
                    }} className={` cursor-pointer ${ state === "signin" ? 'bg-[#e6dfd8]' : 'bg-transparent' } w-full rounded-full py-[5px]`}>
                      {t("auth.signIn")}
                    </button>
                    <button onClick={() => {
                      router.push(path + "?" + createQueryString({ name: "state", value: "signup" }));
                      setState("signup")
                    }} className={` cursor-pointer ${ state === "signup" ? 'bg-[#e6dfd8]' : 'bg-transparent' } w-full rounded-full py-[5px]`}>
                      {t("auth.signUp")}
                    </button>
                </div>
              </>
            )}

            {
              state === "signin" ? <SignIn /> : <SignUp onOtpChange={setOtpShowing} />
            }
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
