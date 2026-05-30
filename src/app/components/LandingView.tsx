"use client";

import { useState } from "react";
import {
  FiCpu,
  FiUsers,
  FiDollarSign,
  FiArrowRight,
  FiStar,
  FiChevronRight,
  FiZap,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import Logo from "./Logo";
import Nav from "../content-landing/Nav";

export default function LandingView() {
  const [activePeekTab, setActivePeekTab] = useState<"ai" | "split" | "minim">("ai");

  return (
    <div className="relative min-h-screen overflow-x-hidden aurora-mesh noise-overlay">
      {/* Ambient Light Orbs */}
      <div className="fixed top-[-15%] left-[-8%] w-[45%] h-[45%] bg-gold/[0.04] rounded-full blur-[140px] pointer-events-none animate-aurora" />
      <div className="fixed bottom-[10%] right-[-12%] w-[50%] h-[50%] bg-ember/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] w-[35%] h-[35%] bg-luxe/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <Nav />     

      {/* ─── HERO SECTION ─── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-28 text-center md:pt-28 lg:pt-36">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold/20 bg-gold/[0.04] text-gold text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8 animate-text-reveal">
          <span className="flex h-1.5 w-1.5 rounded-full bg-gold animate-bounce-subtle" />
          Introducing Triplit AI v2.0
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-[-0.03em] leading-[0.95] max-w-5xl mx-auto mb-5 sm:mb-7 text-stone-900 dark:text-stone-50 animate-text-reveal" style={{ animationDelay: "0.1s" }}>
          Travel Smarter.
          <span className="block mt-2 sm:mt-3 text-gradient-hero">
            Plan Together. Split Easy.
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-stone-500 dark:text-obsidian-muted mb-8 sm:mb-12 leading-relaxed font-sans opacity-0 animate-text-reveal px-2" style={{ animationDelay: "0.25s" }}>
          The collaborative travel portal powered by AI. Design custom itineraries in seconds,
          coordinate with shared boards, and settle group expenses optimally — zero headache.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 sm:mb-20 opacity-0 animate-text-reveal px-2" style={{ animationDelay: "0.35s" }}>
          <button
            // onClick={onLaunchApp}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-[0_4px_24px_rgba(212,168,83,0.3)] hover:shadow-[0_8px_40px_rgba(212,168,83,0.45)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            Start Planning For Free <FiArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#peek"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated text-stone-700 dark:text-stone-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            Interactive Sandbox
          </a>
        </div>

        {/* ─── Dashboard Preview ─── */}
        <div className="relative max-w-5xl mx-auto rounded-2xl p-1 sm:p-1.5 glass-gold shadow-2xl shadow-gold/[0.06] opacity-0 animate-card-enter delay-4">
          <div className="rounded-xl overflow-hidden border border-pearl-border/40 dark:border-obsidian-border/50 bg-pearl-surface/60 dark:bg-obsidian/70 aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] flex flex-col items-stretch">
            {/* Window Bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-pearl-surface/80 dark:bg-obsidian-surface border-b border-pearl-border/60 dark:border-obsidian-border/80">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-accent/70" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gold/60" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-accent/60" />
              </div>
              <div className="text-[9px] sm:text-[11px] font-bold text-stone-400 dark:text-obsidian-muted font-sans tracking-wider uppercase hidden xs:block">
                Triplit Dashboard • Tokyo Summer 2026
              </div>
              <div className="w-8 sm:w-12 h-2" />
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden text-left bg-pearl-card/50 dark:bg-obsidian/90">
              {/* Sidebar Mock — hidden on small screens */}
              <div className="hidden sm:flex col-span-3 border-r border-pearl-border/50 dark:border-obsidian-border/50 p-2 sm:p-3 bg-pearl-surface/30 dark:bg-obsidian-surface/40 flex-col gap-2">
                <div className="w-full h-7 sm:h-8 rounded-lg bg-gold/[0.06] border border-gold/15 flex items-center gap-1.5 sm:gap-2 px-2 text-gold text-[10px] sm:text-xs font-bold">
                  <Logo size={16} className="!rounded !shadow-none" /> Trips
                </div>
                <div className="w-full h-7 sm:h-8 rounded-lg flex items-center gap-1.5 sm:gap-2 px-2 text-stone-400 dark:text-obsidian-muted text-[10px] sm:text-xs font-medium">
                  <FiCpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> AI Planner
                </div>
                <div className="w-full h-7 sm:h-8 rounded-lg flex items-center gap-1.5 sm:gap-2 px-2 text-stone-400 dark:text-obsidian-muted text-[10px] sm:text-xs font-medium">
                  <FiDollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Expenses
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-12 sm:col-span-9 p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3.5 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xs sm:text-base text-stone-800 dark:text-stone-200">Tokyo Adventure</h3>
                    <p className="text-[8px] sm:text-[10px] text-stone-400 dark:text-obsidian-muted">June 12 - June 19 • 4 Friends</p>
                  </div>
                  <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 text-[8px] sm:text-[10px] font-bold">
                    In Budget
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-pearl-border/70 dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-surface flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-stone-400 dark:text-obsidian-muted uppercase tracking-wider">Shared Expenses</span>
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px]">
                      <span className="font-medium text-stone-600 dark:text-stone-300">Shinkansen Tickets</span>
                      <span className="font-bold text-ember">$320</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px]">
                      <span className="font-medium text-stone-600 dark:text-stone-300">Shibuya Sushi</span>
                      <span className="font-bold text-gold">$145</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-pearl-border/70 dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-surface flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-stone-400 dark:text-obsidian-muted uppercase tracking-wider flex items-center gap-1">
                      <FiCpu className="w-2.5 sm:w-3 text-gold" /> AI Assistant
                    </span>
                    <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-pearl-surface dark:bg-obsidian border border-pearl-border/30 dark:border-obsidian-border/50">
                      <p className="text-[8px] sm:text-[9px] text-stone-500 dark:text-obsidian-muted leading-relaxed">
                        3-day Shibuya path mapped. Tap &quot;Apply&quot; to sync.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settle bar */}
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-obsidian-surface to-obsidian-card border border-obsidian-border flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-[8px] sm:text-xs font-bold">A</div>
                    <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-ember" />
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-ember/15 border border-ember/40 flex items-center justify-center text-ember text-[8px] sm:text-xs font-bold">B</div>
                    <span className="text-[8px] sm:text-[10px] text-stone-400 font-medium hidden xs:inline">Alex → Blake <b className="text-white">$125</b></span>
                  </div>
                  <button className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gold text-obsidian font-bold text-[8px] sm:text-[9px] shadow hover:bg-gold-dark active:scale-95 transition-all">
                    Settle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ─── */}
      <section id="features" className="py-16 sm:py-24 lg:py-28 border-t border-pearl-border/50 dark:border-obsidian-border/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold uppercase mb-3 block">Core Capabilities</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-stone-900 dark:text-stone-50 mb-4 sm:mb-5">
              Engineered for Frictionless Group Travel
            </h2>
            <p className="text-stone-500 dark:text-obsidian-muted font-sans text-xs sm:text-sm md:text-base leading-relaxed px-2">
              Every detail optimized to remove planning friction, prevent budget arguments, and curate the perfect itinerary.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-5">
            {/* AI Planner (Large) */}
            <div className="sm:col-span-2 md:col-span-4 p-6 sm:p-8 md:p-10 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:shadow-xl hover:shadow-gold/[0.03] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden opacity-0 animate-card-enter delay-1">
              <div className="absolute top-0 right-0 w-28 sm:w-40 h-28 sm:h-40 bg-gradient-to-bl from-gold/[0.06] to-transparent rounded-bl-full pointer-events-none transition-all duration-500 group-hover:w-36 sm:group-hover:w-52 group-hover:h-36 sm:group-hover:h-52" />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/15 mb-5 sm:mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/10 transition-all duration-300">
                <FiCpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-50 mb-2 sm:mb-3">AI Trip Planner</h3>
              <p className="text-stone-500 dark:text-obsidian-muted text-xs sm:text-sm leading-relaxed font-sans max-w-lg">
                Tell Triplit where you&apos;re headed and who is going. Our localized chatbot instantly structures day-by-day itineraries, complete with dining suggestions, route logistics, and real-time cost estimates.
              </p>
            </div>

            {/* Smart Split */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:shadow-xl hover:shadow-ember/[0.04] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden opacity-0 animate-card-enter delay-2">
              <div className="absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28 bg-gradient-to-tr from-ember/[0.06] to-transparent rounded-tr-full pointer-events-none" />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-ember/10 flex items-center justify-center text-ember border border-ember/15 mb-5 sm:mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-ember/10 transition-all duration-300">
                <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-50 mb-2 sm:mb-3">Smart Splitter</h3>
              <p className="text-stone-500 dark:text-obsidian-muted text-xs sm:text-sm leading-relaxed font-sans">
                Divide expenses equally, unequally, or by shares. Category tags keep budgets clean.
              </p>
            </div>

            {/* Debt Settlement */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:shadow-xl hover:shadow-luxe/[0.04] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden opacity-0 animate-card-enter delay-3">
              <div className="absolute top-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-luxe/[0.06] to-transparent rounded-br-full pointer-events-none" />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-luxe/10 flex items-center justify-center text-luxe border border-luxe/15 mb-5 sm:mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-luxe/10 transition-all duration-300">
                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-50 mb-2 sm:mb-3">Debt Settlement</h3>
              <p className="text-stone-500 dark:text-obsidian-muted text-xs sm:text-sm leading-relaxed font-sans">
                Optimal transaction engine calculates minimum transfers to balance all outstanding debts.
              </p>
            </div>

            {/* Additional Features (Large) */}
            <div className="sm:col-span-2 md:col-span-4 p-6 sm:p-8 md:p-10 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-gradient-to-br from-pearl-card to-pearl-surface dark:from-obsidian-card dark:to-obsidian-surface hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden opacity-0 animate-card-enter delay-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-arctic/10 flex items-center justify-center text-arctic border border-arctic/15">
                    <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-50">Worldwide Coverage</h4>
                  <p className="text-stone-500 dark:text-obsidian-muted text-[11px] sm:text-xs leading-relaxed font-sans">AI trained on 500+ global destinations with local dining data.</p>
                </div>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold border border-gold/15">
                    <FiZap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-50">Instant Sync</h4>
                  <p className="text-stone-500 dark:text-obsidian-muted text-[11px] sm:text-xs leading-relaxed font-sans">AI-generated plans sync directly to your schedule and expense ledger.</p>
                </div>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-accent/10 flex items-center justify-center text-emerald-accent border border-emerald-accent/15">
                    <FiShield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-50">Offline Ready</h4>
                  <p className="text-stone-500 dark:text-obsidian-muted text-[11px] sm:text-xs leading-relaxed font-sans">LocalStorage persistence keeps your data available without a connection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE SANDBOX ─── */}
      <section id="peek" className="py-16 sm:py-24 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 text-left">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold uppercase mb-3 sm:mb-4 block">Sandbox Experiment</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-stone-900 dark:text-stone-50 mb-4 sm:mb-6 leading-[1.05]">
              Experience the core features right now
            </h2>
            <p className="text-stone-500 dark:text-obsidian-muted text-xs sm:text-sm font-sans mb-6 sm:mb-10 leading-relaxed">
              No signup required. Click through the sandbox tabs to preview how simple it is to plan trips, split bills, and get personalized AI recommendations.
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3 font-sans">
              <button
                onClick={() => setActivePeekTab("ai")}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all text-left cursor-pointer duration-300 ${
                  activePeekTab === "ai"
                    ? "border-gold/30 bg-gold/[0.04] text-stone-900 dark:text-stone-50 shadow-lg shadow-gold/[0.04]"
                    : "border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated text-stone-500 dark:text-obsidian-muted"
                }`}
              >
                <FiCpu className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${activePeekTab === "ai" ? "text-gold" : ""}`} />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Interactive AI Assistant</h4>
                  <p className="text-[10px] sm:text-xs text-stone-400 dark:text-obsidian-muted mt-0.5 sm:mt-1 leading-relaxed">Conversational curation with formatted calendar events.</p>
                </div>
              </button>
              <button
                onClick={() => setActivePeekTab("split")}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all text-left cursor-pointer duration-300 ${
                  activePeekTab === "split"
                    ? "border-ember/30 bg-ember/[0.04] text-stone-900 dark:text-stone-50 shadow-lg shadow-ember/[0.04]"
                    : "border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated text-stone-500 dark:text-obsidian-muted"
                }`}
              >
                <FiDollarSign className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${activePeekTab === "split" ? "text-ember" : ""}`} />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Detailed Expense Splitter</h4>
                  <p className="text-[10px] sm:text-xs text-stone-400 dark:text-obsidian-muted mt-0.5 sm:mt-1 leading-relaxed">Divide custom hotel, flight, or activity ledgers instantly.</p>
                </div>
              </button>
              <button
                onClick={() => setActivePeekTab("minim")}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all text-left cursor-pointer duration-300 ${
                  activePeekTab === "minim"
                    ? "border-luxe/30 bg-luxe/[0.04] text-stone-900 dark:text-stone-50 shadow-lg shadow-luxe/[0.04]"
                    : "border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated text-stone-500 dark:text-obsidian-muted"
                }`}
              >
                <FiUsers className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${activePeekTab === "minim" ? "text-luxe" : ""}`} />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Debt Minimization Settlement</h4>
                  <p className="text-[10px] sm:text-xs text-stone-400 dark:text-obsidian-muted mt-0.5 sm:mt-1 leading-relaxed">Simplifies split debts so your group makes the fewest transactions.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sandbox Terminal */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-obsidian-border bg-gradient-to-b from-[#0E0E15] to-[#0A0A10] text-stone-100 shadow-2xl shadow-obsidian/60 p-4 sm:p-6 h-[340px] sm:h-[420px] flex flex-col justify-between text-left overflow-hidden font-sans relative">
              <div className="absolute top-2.5 sm:top-3 right-3 sm:right-4 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-obsidian-muted select-none uppercase">
                Sandbox
              </div>

              {/* AI */}
              {activePeekTab === "ai" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-obsidian-border pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/15 text-gold">
                      <FiCpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] sm:text-xs">Triplit Travel AI</h4>
                      <p className="text-[8px] sm:text-[9px] text-obsidian-muted">Powered by Gemini 3.5</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 overflow-y-auto text-[11px] sm:text-xs pb-3 sm:pb-4">
                    <div className="p-2.5 sm:p-3 bg-obsidian-elevated rounded-xl max-w-[90%] sm:max-w-[85%] self-start border border-obsidian-border">
                      Hi! Ready for your Tokyo vacation? Try asking me to outline a 3-day food tour.
                    </div>
                    <div className="p-2.5 sm:p-3 bg-gold/10 text-gold rounded-xl max-w-[85%] self-end border border-gold/15 font-medium">
                      Plan a 3-day food tour in Tokyo!
                    </div>
                    <div className="p-2.5 sm:p-3 bg-obsidian-elevated rounded-xl max-w-[95%] sm:max-w-[90%] self-start border border-obsidian-border flex flex-col gap-1.5 sm:gap-2">
                      <span className="font-bold text-[9px] sm:text-[10px] text-gold">🗼 TOKYO 3-DAY CULINARY ITINERARY</span>
                      <ul className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-[11px] list-disc list-inside text-stone-300">
                        <li><b>Day 1:</b> Shibuya Ramen Hunt &amp; Izakaya Crawl</li>
                        <li><b>Day 2:</b> Toyosu Sushi Breakfast &amp; Matcha in Ginza</li>
                        <li><b>Day 3:</b> Harajuku Crepes &amp; Golden Gai Drinks</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-obsidian-border pt-2.5 sm:pt-3">
                    <input disabled placeholder="Ask the AI Travel Assistant..." className="flex-1 bg-obsidian-elevated rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs border border-obsidian-border text-obsidian-muted select-none" />
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gold text-obsidian font-bold text-[11px] sm:text-xs rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                      Plan <FiChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Split */}
              {activePeekTab === "split" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-obsidian-border pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
                    <h4 className="font-bold text-[11px] sm:text-xs text-ember flex items-center gap-1.5">
                      <FiDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Group Travel Ledger
                    </h4>
                    <span className="text-[9px] sm:text-[10px] bg-obsidian-elevated border border-obsidian-border px-1.5 sm:px-2 py-0.5 rounded text-obsidian-muted">
                      Total: $680
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 sm:gap-2.5 pb-3 sm:pb-4">
                    <div className="p-2.5 sm:p-3 bg-obsidian-elevated border border-obsidian-border rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-[11px] sm:text-xs">Shibuya Airbnb Lodging</h5>
                        <p className="text-[9px] sm:text-[10px] text-obsidian-muted">Alice • 4 friends</p>
                      </div>
                      <span className="font-black text-[11px] sm:text-xs text-emerald-accent">$480</span>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-obsidian-elevated border border-obsidian-border rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-[11px] sm:text-xs">Roppongi Sushi Dinner</h5>
                        <p className="text-[9px] sm:text-[10px] text-obsidian-muted">Bob • 4 friends</p>
                      </div>
                      <span className="font-black text-[11px] sm:text-xs text-emerald-accent">$200</span>
                    </div>
                    <div className="text-center py-1.5 sm:py-2 text-[9px] sm:text-[10px] text-obsidian-muted border border-dashed border-obsidian-border rounded-xl">+ Add Expense</div>
                  </div>
                  <div className="border-t border-obsidian-border pt-2.5 sm:pt-3 flex justify-between items-center">
                    <span className="text-[9px] sm:text-[10px] text-obsidian-muted hidden sm:inline">Log hotels, dining, travel fares instantly.</span>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-ember text-white font-bold text-[11px] sm:text-xs rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                      Try Splitter <FiChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Minimize */}
              {activePeekTab === "minim" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-obsidian-border pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
                    <h4 className="font-bold text-[11px] sm:text-xs text-luxe flex items-center gap-1.5">
                      <FiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Settlement
                    </h4>
                    <span className="text-[9px] sm:text-[10px] bg-obsidian-elevated border border-obsidian-border px-1.5 sm:px-2 py-0.5 rounded text-obsidian-muted">Optimized</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center gap-3 sm:gap-4 text-center px-2">
                    <div className="flex items-center gap-3 sm:gap-6 py-3 sm:py-4 flex-wrap justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-obsidian-elevated border border-obsidian-border flex items-center justify-center text-[10px] sm:text-xs font-bold text-stone-300">Bob</div>
                        <span className="text-[8px] sm:text-[9px] text-obsidian-muted mt-1">-$70</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-rose-accent animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-bold text-rose-accent bg-rose-accent/10 border border-rose-accent/20 px-1 sm:px-1.5 py-0.5 rounded mt-1">$70</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gold">Alice</div>
                        <span className="text-[8px] sm:text-[9px] text-emerald-accent mt-1">+$120</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-rose-accent animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-bold text-rose-accent bg-rose-accent/10 border border-rose-accent/20 px-1 sm:px-1.5 py-0.5 rounded mt-1">$50</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-obsidian-elevated border border-obsidian-border flex items-center justify-center text-[10px] sm:text-xs font-bold text-stone-300">Chris</div>
                        <span className="text-[8px] sm:text-[9px] text-obsidian-muted mt-1">-$50</span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 max-w-sm leading-relaxed">
                      Triplit reduces transactions to <b className="text-stone-200">2 simple peer-to-peer transfers</b>!
                    </p>
                  </div>
                  <div className="border-t border-obsidian-border pt-2.5 sm:pt-3 flex justify-between items-center">
                    <span className="text-[9px] sm:text-[10px] text-obsidian-muted hidden sm:inline">Zero duplicate transfers.</span>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-luxe text-white font-bold text-[11px] sm:text-xs rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                      Settle <FiChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-28 border-t border-pearl-border/50 dark:border-obsidian-border/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold uppercase mb-3 block">User Reviews</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-stone-900 dark:text-stone-50">
              Approved by Global Explorers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { quote: "Our trip to Tokyo was a breeze. We split expenses between 6 friends, and the settlement graph showed us exactly how to pay. The AI planner booked all our dining slots flawlessly!", name: "Han M.", detail: "Traveled to Tokyo • 6 Friends", initials: "HM", gradient: "from-gold to-gold-dark text-obsidian" },
              { quote: "Honestly, I hated split bills before Triplit. Settle up math used to take us hours on spreadsheets. Triplit does it immediately, and the design is just gorgeous to look at!", name: "Sophia L.", detail: "Euro Summer Tour • 4 Friends", initials: "SL", gradient: "from-ember to-ember-dark text-white" },
              { quote: "I was skeptical about AI planning but Triplit's assistant is incredibly responsive. I literally asked for an art-deco itinerary in Miami and it mapped out a flawless day-by-day roadmap!", name: "Julian D.", detail: "Miami Beach Plan • 3 Friends", initials: "JD", gradient: "from-luxe to-luxe-dark text-white" },
            ].map((review, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-7 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-400 opacity-0 animate-card-enter"
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <div>
                  <div className="flex gap-1 mb-4 sm:mb-5 text-gold">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current w-3.5 h-3.5 sm:w-4 sm:h-4" />)}
                  </div>
                  <p className="text-stone-600 dark:text-obsidian-muted text-xs sm:text-sm leading-relaxed italic font-sans mb-5 sm:mb-7">
                    &quot;{review.quote}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-pearl-border/50 dark:border-obsidian-border/50">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center font-bold text-[10px] sm:text-xs font-sans`}>
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-xs text-stone-900 dark:text-stone-100">{review.name}</h4>
                    <p className="text-[9px] sm:text-[10px] text-stone-400 dark:text-obsidian-muted">{review.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-16 sm:py-24 text-center relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative p-6 sm:p-10 md:p-20 rounded-2xl sm:rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/[0.02] to-ember/[0.02] glass-gold max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl text-stone-900 dark:text-stone-50 mb-4 sm:mb-5 tracking-tight">
            Ready to design your next dream vacation?
          </h2>
          <p className="text-stone-500 dark:text-obsidian-muted text-xs sm:text-sm md:text-base font-sans max-w-2xl mb-6 sm:mb-10 leading-relaxed px-2">
            Join thousands of travelers planning, scheduling, and splitting expenses flawlessly with Triplit.
          </p>
          <button
            className="px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-[0_4px_30px_rgba(212,168,83,0.25)] hover:shadow-[0_8px_50px_rgba(212,168,83,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            Launch Interactive Portal <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-pearl-border/50 dark:border-obsidian-border/40 py-8 sm:py-12 text-stone-400 dark:text-obsidian-muted text-[11px] sm:text-xs font-sans mt-4 sm:mt-8 bg-pearl-card/50 dark:bg-obsidian/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100">
              triplit
            </span>
          </div>
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Triplit. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors duration-200">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
