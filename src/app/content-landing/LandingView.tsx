"use client";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiArrowDown,
  FiCheck,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import Logo from "../components/Logo";
import Nav from "./Nav";
import Reveal from "./Reveal";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";

/* ── Friends used across the ledger + settlement, kept consistent so the
   page reads like one real trip. Tone classes are spelled out (no dynamic
   class strings, which Tailwind can't see). ───────────────────────────── */
type Tone = "coral" | "teal" | "meadow" | "ink";

const AVATAR_TONE: Record<Tone, string> = {
  coral: "bg-sunset text-white",
  teal: "bg-coast text-white",
  meadow: "bg-meadow text-white",
  ink: "bg-ink text-canvas",
};

function Avatar({
  name,
  tone,
  size = 36,
}: {
  name: string;
  tone: Tone;
  size?: number;
}) {
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

/* Sample trip data (place names stay literal, per project convention). */
const LEDGER = [
  { item: "Shibuya apartment, 7 nights", payer: "Mei", tone: "coral" as Tone, amount: 480 },
  { item: "Shinkansen to Hakone", payer: "Ken", tone: "teal" as Tone, amount: 320 },
  { item: "Toyosu sushi breakfast", payer: "Priya", tone: "meadow" as Tone, amount: 145 },
  { item: "Izakaya night in Ginza", payer: "Sam", tone: "ink" as Tone, amount: 210 },
  { item: "Hakone ryokan & onsen", payer: "Mei", tone: "coral" as Tone, amount: 390 },
];
const LEDGER_TOTAL = LEDGER.reduce((sum, row) => sum + row.amount, 0);

export default function LandingView() {
  const { t } = useLanguage();
  const router = useRouter();
  const goAuth = () => router.push("/authentication");

  return (
    <div id="top" className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Nav />

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="relative overflow-hidden">
          {/* faint topographic motif */}
          <Contours className="pointer-events-none absolute -right-24 -top-16 hidden h-[460px] w-[460px] text-line-strong/50 lg:block" />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
            <div className="relative z-10">
              <Reveal>
                <p className="mb-5 inline-flex items-center gap-2 text-[15px] font-semibold text-coast-deep">
                  <span className="inline-block h-2 w-2 rounded-full bg-coast" />
                  For groups that travel together
                </p>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.02] tracking-[-0.02em] text-ink [text-wrap:balance]">
                  {t("landing.hero.titleA")}
                  <br />
                  {t("landing.hero.titleB")}
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-sunset-deep">
                      {t("landing.hero.titleC")}
                    </span>
                    <Underline className="absolute -bottom-1 left-0 z-0 w-full text-sunset" />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">
                  {t("landing.hero.sub")}
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-8 flex flex-col items-start gap-x-5 gap-y-4 sm:flex-row sm:items-center">
                  <button
                    onClick={goAuth}
                    className="lp-focus group inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset-deep px-7 py-3.5 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                  >
                    {t("landing.hero.ctaPrimary")}
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="#settle"
                    className="lp-focus inline-flex items-center gap-2 text-base font-semibold text-ink transition-colors hover:text-sunset-ink"
                  >
                    {t("landing.hero.ctaSecondary")}
                    <FiArrowDown className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <p className="mt-6 font-hand text-xl text-coast-deep">
                  {t("landing.hero.note")}
                </p>
              </Reveal>
            </div>

            {/* Scrap composition */}
            <Reveal delay={120} className="relative">
              <HeroScene t={t} />
            </Reveal>
          </div>
        </section>

        {/* ──────────────── SHOWN, NOT CLAIMED ──────────────── */}
        <section id="trip" className="scroll-mt-20 border-t border-line bg-canvas-sink/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="max-w-2xl">
              <Reveal>
                <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]">
                  {t("landing.trip.title")}
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">
                  {t("landing.trip.body")}
                </p>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
              {/* The plan */}
              <Reveal delay={60} className="flex flex-col rounded-3xl border border-line bg-canvas p-6 lp-postcard sm:p-7">
                <PanelHead label={t("landing.trip.planTitle")} tone="teal" />
                <ol className="mt-6 space-y-6">
                  {[
                    { d: "Day 1", text: t("landing.trip.day1"), tone: "coral" as Tone },
                    { d: "Day 2", text: t("landing.trip.day2"), tone: "teal" as Tone },
                    { d: "Day 3", text: t("landing.trip.day3"), tone: "meadow" as Tone },
                  ].map((day, i, arr) => (
                    <li key={day.d} className="relative flex gap-4">
                      {i < arr.length - 1 && (
                        <span className="absolute left-[13px] top-7 h-[calc(100%+0.6rem)] w-px bg-line-strong" />
                      )}
                      <span
                        className={`relative z-10 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${AVATAR_TONE[day.tone]}`}
                      >
                        <FiMapPin className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                          {day.d}
                        </p>
                        <p className="mt-0.5 text-[15px] font-medium leading-snug text-ink">
                          {day.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto pt-7">
                  <div className="border-t border-line pt-5">
                    <RouteMap className="w-full text-coast" />
                  </div>
                </div>
              </Reveal>

              {/* Shared ledger */}
              <Reveal delay={140} className="rounded-3xl border border-line bg-canvas p-6 lp-postcard sm:p-7">
                <PanelHead label={t("landing.trip.ledgerTitle")} tone="coral" />
                <ul className="mt-5 divide-y divide-line">
                  {LEDGER.map((row) => (
                    <li key={row.item} className="flex items-center gap-3 py-3">
                      <Avatar name={row.payer} tone={row.tone} size={34} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium text-ink">{row.item}</p>
                        <p className="text-[13px] text-ink-faint">
                          {t("landing.trip.paidBy", { name: row.payer })}
                          {"  ·  "}
                          {t("landing.trip.splitWays", { n: 4 })}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">
                        ${row.amount}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-shell px-4 py-3">
                  <span className="text-[15px] font-semibold text-ink">
                    {t("landing.trip.total")}
                  </span>
                  <span className="font-serif text-2xl text-ink tabular-nums">
                    ${LEDGER_TOTAL.toLocaleString()}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ──────────────── THE SETTLEMENT MOMENT ──────────────── */}
        <section id="settle" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="max-w-2xl">
              <Reveal>
                <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]">
                  {t("landing.settle.title")}
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">
                  {t("landing.settle.body")}
                </p>
              </Reveal>
            </div>

            <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-3">
              {/* BEFORE: tangle */}
              <Reveal delay={60} className="flex flex-col rounded-3xl border border-line bg-canvas-sink/70 p-6 sm:p-7">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-ink">
                    {t("landing.settle.before")}
                  </h3>
                  <span className="rounded-full bg-shell px-2.5 py-1 text-xs font-medium text-ink-faint">
                    {t("landing.settle.beforeMeta")}
                  </span>
                </div>
                <div className="grid flex-1 place-items-center py-2">
                  <TangleGraphic />
                </div>
              </Reveal>

              {/* Arrow between */}
              <div className="grid place-items-center">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-canvas text-sunset-deep shadow-sm">
                  <FiArrowRight className="h-5 w-5 lg:rotate-0 max-lg:rotate-90" />
                </span>
              </div>

              {/* AFTER: the payoff, the page's one dark moment */}
              <Reveal delay={140} className="flex flex-col rounded-3xl bg-ink p-6 text-canvas sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-canvas">
                    {t("landing.settle.after")}
                  </h3>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-sun">
                    {t("landing.settle.afterMeta")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-center gap-3">
                  {[
                    { from: "Priya", fromTone: "meadow" as Tone, to: "Ken", toTone: "teal" as Tone, amount: 84 },
                    { from: "Sam", fromTone: "ink" as Tone, to: "Mei", toTone: "coral" as Tone, amount: 52 },
                  ].map((p) => (
                    <div
                      key={`${p.from}-${p.to}`}
                      className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3"
                      aria-label={`${p.from} ${t("landing.settle.owes")} ${p.to} $${p.amount}`}
                    >
                      <Avatar name={p.from} tone={p.fromTone} size={34} />
                      <span className="text-sm font-medium text-canvas/70">{p.from}</span>
                      <FiArrowRight className="h-4 w-4 shrink-0 text-sun" />
                      <Avatar name={p.to} tone={p.toTone} size={34} />
                      <span className="text-sm font-medium text-canvas/70">{p.to}</span>
                      <span className="ml-auto font-serif text-xl tabular-nums text-canvas">
                        ${p.amount}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 flex items-center gap-2 font-hand text-2xl text-sun">
                  <FiCheck className="h-5 w-5" />
                  {t("landing.settle.note")}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ──────────────── HOW IT WORKS ──────────────── */}
        <section id="how" className="scroll-mt-20 border-t border-line bg-canvas-sink/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <Reveal>
              <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]">
                {t("landing.how.title")}
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3">
              {[
                { n: 1, illo: <StepInvite />, title: t("landing.how.s1Title"), body: t("landing.how.s1Body") },
                { n: 2, illo: <StepLog />, title: t("landing.how.s2Title"), body: t("landing.how.s2Body") },
                { n: 3, illo: <StepSettle />, title: t("landing.how.s3Title"), body: t("landing.how.s3Body") },
              ].map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 90} className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-canvas font-serif text-lg text-ink">
                      {step.n}
                    </span>
                    {i < 2 && (
                      <span className="hidden h-px flex-1 bg-line-strong sm:block" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mb-4 h-20">{step.illo}</div>
                  <h3 className="font-serif text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft [text-wrap:pretty]">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ──────────────── ONE VOICE ──────────────── */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:py-28">
            <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-canvas p-8 lp-postcard sm:p-12">
              <Stamp className="absolute right-6 top-6 hidden h-20 w-16 text-line-strong sm:block" />
              <blockquote className="font-serif text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.18] tracking-[-0.01em] text-ink [text-wrap:balance]">
                &ldquo;{t("landing.voices.quote")}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <Avatar name={t("landing.voices.name")} tone="coral" size={44} />
                <div>
                  <p className="font-semibold text-ink">{t("landing.voices.name")}</p>
                  <p className="text-sm text-ink-faint">{t("landing.voices.detail")}</p>
                </div>
              </figcaption>
            </Reveal>
          </div>
        </section>

        {/* ──────────────── CLOSING CTA ──────────────── */}
        <section className="px-4 pb-20 sm:px-6 lg:pb-28">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-sunset-deep px-6 py-16 text-center sm:px-10 sm:py-20">
            <RouteBand className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 text-white/25 md:block" />
            <h2 className="relative font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.02em] text-white [text-wrap:balance]">
              {t("landing.cta.title")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white [text-wrap:pretty]">
              {t("landing.cta.body")}
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-4">
              <button
                onClick={goAuth}
                className="lp-focus group inline-flex items-center gap-2 rounded-full bg-canvas px-8 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("landing.cta.button")}
                <FiArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <p className="font-hand text-xl text-white/90">{t("landing.cta.note")}</p>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="border-t border-line bg-canvas-sink/70">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <Logo size={32} className="!rounded-lg !shadow-none" />
            <div>
              <p className="font-serif text-xl leading-none text-ink">triplit</p>
              <p className="mt-1 text-sm text-ink-faint">{t("landing.footer.tagline")}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-ink-faint sm:items-end">
            <div className="flex gap-5">
              <a href="#" className="lp-focus transition-colors hover:text-ink">
                {t("landing.footer.privacy")}
              </a>
              <a href="#" className="lp-focus transition-colors hover:text-ink">
                {t("landing.footer.terms")}
              </a>
            </div>
            <p>
              © {new Date().getFullYear()} Triplit. {t("landing.footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Local presentational helpers
   ════════════════════════════════════════════════════════════════════ */

function PanelHead({ label, tone }: { label: string; tone: Tone }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-2.5 w-2.5 rounded-full ${AVATAR_TONE[tone]}`} />
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
    </div>
  );
}

/* The hero "scrapbook" composition: a real trip card with a route mini-map,
   plus a peeking ledger card and a handwritten note (extras hidden on small
   screens to avoid overflow). */
function HeroScene({ t }: { t: (key: string, vars?: Record<string, string | number>) => string }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Main trip card */}
      <div className="relative z-20 rotate-[-1.5deg] rounded-[1.75rem] border border-line bg-canvas p-5 lp-postcard sm:p-6">
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
          <button className="lp-focus inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-canvas">
            <FiPlus className="h-3.5 w-3.5" />
            Add expense
          </button>
        </div>
      </div>

      {/* Balance scrap: a complete, intentional floating chip (not a cut-off card) */}
      <div className="absolute -bottom-7 -left-4 z-30 hidden rotate-[-5deg] items-center gap-2.5 rounded-2xl border border-line bg-canvas px-4 py-3 lp-postcard lp-float sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-meadow/12 text-meadow-deep">
          <FiCheck className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-medium text-ink-faint">{t("landing.hero.owed")}</p>
          <p className="font-serif text-lg text-meadow-deep tabular-nums">+$120</p>
        </div>
      </div>

      {/* Handwritten note */}
      <div className="absolute -right-2 -top-8 z-30 hidden rotate-[7deg] sm:block">
        <p className="font-hand text-2xl leading-tight text-sunset-deep">
          {t("landing.hero.cardTag")}
        </p>
        <NoteArrow className="ml-6 mt-0 h-8 w-12 text-sunset" />
      </div>
    </div>
  );
}

/* ── Inline SVG illustrations (the page's imagery, since there are no photos) ── */

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
      <path
        d="M250 18 l10 6 -10 6 2 -6 z"
        fill="var(--color-sunset)"
        transform="rotate(18 255 24)"
      />
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

function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 16" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M4 11 C 70 4, 150 4, 296 9"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NoteArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4 C 20 6, 34 14, 40 30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M40 30 l-9 -2 M40 30 l-2 -9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="58" height="74" rx="3" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M14 50 l12 -16 9 11 7 -7 8 12 z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="42" cy="24" r="6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/* "Before" settlement tangle: 4 friends, many crisscrossing debts. */
function TangleGraphic() {
  const nodes = [
    { x: 34, y: 34, tone: "var(--color-sunset)", initial: "M" },
    { x: 152, y: 34, tone: "var(--color-coast)", initial: "K" },
    { x: 34, y: 146, tone: "var(--color-meadow)", initial: "P" },
    { x: 152, y: 146, tone: "var(--color-ink)", initial: "S" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
  ];
  return (
    <svg viewBox="0 0 186 180" fill="none" className="h-auto w-full max-w-[260px]" role="img" aria-label="Many tangled debts between four friends">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={i % 2 ? "var(--color-sunset)" : "var(--color-coast)"}
          strokeWidth="1.6"
          strokeOpacity="0.5"
          strokeDasharray="3 4"
        />
      ))}
      {nodes.map((n) => (
        <g key={n.initial}>
          <circle cx={n.x} cy={n.y} r="18" fill={n.tone} />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontSize="15"
            fontWeight="600"
            fill={n.tone === "var(--color-ink)" ? "var(--color-canvas)" : "#fff"}
          >
            {n.initial}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StepInvite() {
  return (
    <svg viewBox="0 0 80 60" fill="none" className="h-full" aria-hidden="true">
      <circle cx="26" cy="26" r="13" fill="var(--color-coast)" />
      <circle cx="44" cy="26" r="13" fill="var(--color-sunset)" stroke="var(--color-canvas)" strokeWidth="2.5" />
      <circle cx="58" cy="34" r="9" fill="var(--color-meadow)" stroke="var(--color-canvas)" strokeWidth="2.5" />
      <g stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M16 50 h12 M22 44 v12" />
      </g>
    </svg>
  );
}

function StepLog() {
  return (
    <svg viewBox="0 0 80 60" fill="none" className="h-full" aria-hidden="true">
      <path
        d="M22 6 h28 a3 3 0 0 1 3 3 v45 l-5 -3 -5 3 -5 -3 -5 3 -5 -3 -5 3 V9 a3 3 0 0 1 3 -3 z"
        fill="var(--color-canvas)"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <g stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round">
        <path d="M28 18 h16 M28 26 h16 M28 34 h10" />
      </g>
      <circle cx="56" cy="42" r="11" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="2.2" />
      <text x="56" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)">$</text>
    </svg>
  );
}

function StepSettle() {
  return (
    <svg viewBox="0 0 80 60" fill="none" className="h-full" aria-hidden="true">
      <path d="M10 18 H44" stroke="var(--color-coast)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44 18 l-7 -5 M44 18 l-7 5" stroke="var(--color-coast)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 42 H44" stroke="var(--color-sunset)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44 42 l-7 -5 M44 42 l-7 5" stroke="var(--color-sunset)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="30" r="13" fill="var(--color-meadow)" />
      <path d="M54 30 l4 4 8 -8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RouteBand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 80" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 40 C 200 10, 360 70, 560 40 S 920 10, 1200 44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <circle cx="560" cy="40" r="6" fill="currentColor" />
      <circle cx="120" cy="33" r="6" fill="currentColor" />
      <circle cx="1040" cy="36" r="6" fill="currentColor" />
    </svg>
  );
}
