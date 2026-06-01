"use client";

import { useState } from "react";
import { FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";
import Logo from "../components/Logo";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/app/components/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageProvider";

const LINKS = [
  { href: "#trip", key: "nav.trip" },
  { href: "#settle", key: "nav.settle" },
  { href: "#how", key: "nav.how" },
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const goAuth = () => router.push("/authentication");

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 lp-focus" aria-label="Triplit home">
          <Logo size={32} className="!rounded-lg !shadow-none" />
          <span className="font-serif text-2xl leading-none text-ink">triplit</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="lp-focus text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <button
            onClick={goAuth}
            className="lp-focus hidden rounded-full px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:text-sunset-ink sm:block"
          >
            {t("common.signIn")}
          </button>
          <button
            onClick={goAuth}
            className="lp-focus hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[15px] font-semibold text-canvas transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex"
          >
            {t("landing.hero.ctaPrimary")}
            <FiArrowUpRight className="h-4 w-4" />
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lp-focus rounded-lg border border-line p-2 text-ink md:hidden"
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-canvas px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="lp-focus border-b border-line/70 py-3 text-base font-medium text-ink"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => {
                goAuth();
                setOpen(false);
              }}
              className="lp-focus flex-1 rounded-full border border-line py-2.5 text-[15px] font-semibold text-ink"
            >
              {t("common.signIn")}
            </button>
            <button
              onClick={() => {
                goAuth();
                setOpen(false);
              }}
              className="lp-focus flex-1 rounded-full bg-ink py-2.5 text-[15px] font-semibold text-canvas"
            >
              {t("landing.hero.ctaPrimary")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
