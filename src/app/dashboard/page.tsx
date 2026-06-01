"use client";

import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiClock,
  FiCompass,
  FiCoffee,
  FiNavigation,
  FiHome,
  FiArrowRight,
} from "react-icons/fi";
import { useDashboard } from "./layout/DashboardContext";
import { useLanguage } from "@/i18n/LanguageProvider";

const CATEGORY_META = {
  dining: { Icon: FiCoffee, badge: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
  activity: { Icon: FiCompass, badge: "bg-blue-primary/12 text-blue-dark dark:bg-gold/12 dark:text-gold" },
  transport: { Icon: FiNavigation, badge: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
  lodging: { Icon: FiHome, badge: "bg-luxe/15 text-luxe-dark dark:text-luxe-muted" },
} as const;

export default function DashboardPage() {
  const { t } = useLanguage();
  const {
    trips,
    selectedTripId,
    setSelectedTripId,
    activeTrip,
    handleCreateTrip,
    handleDeleteTrip,
    showAddForm,
    setShowAddForm,
    newTripName,
    setNewTripName,
    newDestination,
    setNewDestination,
    newDates,
    setNewDates,
    saveTrips,
  } = useDashboard();

  if (!activeTrip) {
    return (
      <div className="flex flex-col gap-6 font-sans" aria-busy="true" aria-live="polite">
        <div className="h-36 rounded-2xl bg-pearl-surface dark:bg-obsidian-card animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-pearl-surface dark:bg-obsidian-card animate-pulse" />
          <div className="h-72 rounded-2xl bg-pearl-surface dark:bg-obsidian-card animate-pulse" />
        </div>
      </div>
    );
  }

  // Group itinerary stops by day (pure; React-Compiler safe).
  const dayNumbers = [...new Set(activeTrip.itinerary.map((act) => act.day))].sort((a, b) => a - b);
  const days = dayNumbers.map((day) => ({
    day,
    items: activeTrip.itinerary.filter((act) => act.day === day),
  }));
  const stopCount = activeTrip.itinerary.length;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* ── Trip hero ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-subtle dark:bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-blue-dark dark:text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-primary dark:bg-gold" aria-hidden />
              {t("trips.activeSchedule")}
            </span>
            <h2 className="mt-3 flex items-center gap-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-stone-50 text-balance">
              <FiMapPin className="h-5 w-5 shrink-0 text-ember" aria-hidden />
              <span className="truncate">{activeTrip.destination}</span>
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-stone-300">
              <FiCalendar className="h-4 w-4 shrink-0" aria-hidden /> {activeTrip.dates}
            </p>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-500 dark:text-stone-400">
              {t("trips.intro")}
            </p>
          </div>

          {/* People + quick counts */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 md:flex-col md:items-end md:gap-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {activeTrip.friends.slice(0, 4).map((friend) => (
                  <span
                    key={friend.id}
                    title={friend.name}
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${friend.color} text-xs font-bold ring-2 ring-pearl-card dark:ring-obsidian-card`}
                  >
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                ))}
                {activeTrip.friends.length > 4 && (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pearl-surface dark:bg-obsidian-elevated text-xs font-bold text-slate-600 dark:text-stone-300 ring-2 ring-pearl-card dark:ring-obsidian-card">
                    +{activeTrip.friends.length - 4}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-stone-200 tabular-nums">
                {activeTrip.friends.length} {t("dashboard.friends")}
              </span>
            </div>
            <span className="rounded-lg bg-pearl-surface dark:bg-obsidian-elevated px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-stone-200 tabular-nums">
              {t("ai.stops", { n: stopCount })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Create trip form ──────────────────────────────────── */}
      {showAddForm && (
        <section className="rounded-2xl border border-blue-primary/25 dark:border-gold/25 bg-blue-subtle/40 dark:bg-gold/[0.04] p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-stone-50">
              {t("trips.newTrip")}
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-stone-400 dark:hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold cursor-pointer"
            >
              {t("common.cancel")}
            </button>
          </div>
          <form
            onSubmit={handleCreateTrip}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
          >
            <Field label={t("trips.tripName")}>
              <input
                required
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder={t("trips.tripNamePlaceholder")}
                className={inputClass}
              />
            </Field>
            <Field label={t("trips.destination")}>
              <input
                required
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder={t("trips.destinationPlaceholder")}
                className={inputClass}
              />
            </Field>
            <Field label={t("trips.dates")}>
              <input
                value={newDates}
                onChange={(e) => setNewDates(e.target.value)}
                placeholder={t("trips.datesPlaceholder")}
                className={inputClass}
              />
            </Field>
            <button
              type="submit"
              className="h-[42px] rounded-lg bg-blue-primary dark:bg-gold px-5 text-sm font-bold text-white dark:text-obsidian shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold dark:focus-visible:ring-offset-obsidian cursor-pointer"
            >
              {t("common.create")}
            </button>
          </form>
        </section>
      )}

      {/* ── Itinerary + trips ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Itinerary */}
        <section className="lg:col-span-2 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-pearl-border dark:border-obsidian-border pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-stone-50">
                {t("trips.schedule")}
              </h3>
              {stopCount > 0 && (
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-stone-400">
                  {t("ai.stops", { n: stopCount })}
                </p>
              )}
            </div>
            {stopCount > 0 && (
              <button
                onClick={() => {
                  const updated = trips.map((trip) =>
                    trip.id === selectedTripId ? { ...trip, itinerary: [] } : trip
                  );
                  saveTrips(updated);
                }}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-rose-accent/10 hover:text-rose-accent dark:text-stone-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-accent cursor-pointer"
              >
                {t("trips.clearSchedule")}
              </button>
            )}
          </div>

          {stopCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-subtle dark:bg-gold/10 text-blue-primary dark:text-gold">
                <FiCompass className="h-7 w-7" aria-hidden />
              </span>
              <h4 className="font-display text-base font-bold text-slate-900 dark:text-stone-50">
                {t("trips.emptyTitle")}
              </h4>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-stone-400">
                {t("trips.emptyGoTo")} {t("trips.emptyGenerate")}
              </p>
              <Link
                href="/dashboard/ai"
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-blue-primary dark:bg-gold px-4 py-2 text-sm font-bold text-white dark:text-obsidian shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold dark:focus-visible:ring-offset-obsidian"
              >
                {t("trips.emptyAiChat")} <FiArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <ol className="relative space-y-7">
              {/* rail */}
              <span
                className="pointer-events-none absolute left-[15px] top-3 bottom-3 w-px bg-pearl-border dark:bg-obsidian-border"
                aria-hidden
              />
              {days.map(({ day, items }) => (
                <li key={day} className="space-y-3">
                  {/* Day marker */}
                  <div className="relative flex items-center gap-3 pl-0">
                    <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-primary dark:bg-gold text-[11px] font-bold text-white dark:text-obsidian tabular-nums ring-4 ring-pearl-card dark:ring-obsidian-card">
                      {day}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-stone-50">
                      {t("trips.day")} {day}
                    </h4>
                  </div>

                  {/* Stops */}
                  <ul className="space-y-3 pl-11">
                    {items.map((act, idx) => {
                      const meta = CATEGORY_META[act.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.activity;
                      const { Icon } = meta;
                      return (
                        <li
                          key={`${day}-${idx}`}
                          className="group relative rounded-xl border border-pearl-border dark:border-obsidian-border/70 bg-pearl-surface/40 dark:bg-obsidian-elevated/40 p-3.5 transition-colors hover:border-blue-primary/30 dark:hover:border-gold/30"
                        >
                          {/* node on the rail */}
                          <span
                            className="absolute -left-[33px] top-5 h-2.5 w-2.5 rounded-full border-2 border-pearl-card bg-pearl-border dark:border-obsidian-card dark:bg-obsidian-border group-hover:bg-blue-primary dark:group-hover:bg-gold transition-colors"
                            aria-hidden
                          />
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-stone-400 tabular-nums">
                                  <FiClock className="h-3.5 w-3.5" aria-hidden /> {act.time}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                                >
                                  <Icon className="h-3 w-3" aria-hidden />
                                  {t(`categories.${act.category}`)}
                                </span>
                              </div>
                              <h5 className="mt-1.5 font-display text-sm font-bold text-slate-900 dark:text-stone-100">
                                {act.title}
                              </h5>
                              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-stone-400">
                                {act.description}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-sm font-bold text-slate-900 dark:text-stone-50 tabular-nums">
                                ${act.costEstimate}
                              </span>
                              <span className="block text-[10px] font-medium text-slate-400 dark:text-stone-500">
                                {t("trips.estimated")}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* My trips */}
        <section className="rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm p-5 sm:p-6 lg:self-start">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-stone-50">
              {t("trips.myTrips")}
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-primary dark:bg-gold px-2.5 py-1.5 text-xs font-bold text-white dark:text-obsidian shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold dark:focus-visible:ring-offset-obsidian cursor-pointer"
            >
              <FiPlus className="h-3.5 w-3.5" aria-hidden /> {t("trips.addNew")}
            </button>
          </div>
          <ul className="space-y-2">
            {trips.map((trip) => {
              const isActive = trip.id === selectedTripId;
              return (
                <li key={trip.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTripId(trip.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedTripId(trip.id);
                      }
                    }}
                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold ${
                      isActive
                        ? "border-blue-primary/30 dark:border-gold/30 bg-blue-subtle/60 dark:bg-gold/[0.07]"
                        : "border-pearl-border dark:border-obsidian-border bg-transparent hover:bg-pearl-surface/60 dark:hover:bg-obsidian-elevated/50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isActive
                            ? "text-blue-dark dark:text-gold"
                            : "text-slate-800 dark:text-stone-200"
                        }`}
                      >
                        {trip.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-stone-400">
                        {trip.destination}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-rose-accent/10 hover:text-rose-accent dark:text-stone-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-accent cursor-pointer"
                      title={t("common.delete")}
                      aria-label={`${t("common.delete")} ${trip.name}`}
                    >
                      <FiTrash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-surface px-3 py-2.5 text-sm text-slate-800 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 transition-colors focus:border-blue-primary dark:focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary/30 dark:focus-visible:ring-gold/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-600 dark:text-stone-300">{label}</span>
      {children}
    </label>
  );
}
