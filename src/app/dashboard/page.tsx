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
import { useDashboard, friendTone } from "./layout/DashboardContext";
import { useLanguage } from "@/i18n/LanguageProvider";

const CATEGORY_META = {
  dining: { Icon: FiCoffee, badge: "bg-sunset-wash text-sunset-ink" },
  activity: { Icon: FiCompass, badge: "bg-meadow/15 text-meadow-deep" },
  transport: { Icon: FiNavigation, badge: "bg-coast-wash text-coast-deep" },
  lodging: { Icon: FiHome, badge: "bg-sun/25 text-ink" },
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
        <div className="h-36 animate-pulse rounded-3xl bg-canvas-sink" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-3xl bg-canvas-sink lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-3xl bg-canvas-sink" />
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
      <section className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coast-wash px-2.5 py-1 text-[11px] font-semibold text-coast-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-coast" aria-hidden />
              {t("trips.activeSchedule")}
            </span>
            <h2 className="mt-3 flex items-center gap-2 font-serif text-2xl tracking-[-0.01em] text-ink [text-wrap:balance] sm:text-3xl">
              <FiMapPin className="h-5 w-5 shrink-0 text-sunset" aria-hidden />
              <span className="truncate">{activeTrip.destination}</span>
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink-soft">
              <FiCalendar className="h-4 w-4 shrink-0" aria-hidden /> {activeTrip.dates}
            </p>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft [text-wrap:pretty]">
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
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold ring-2 ring-canvas ${friendTone(friend.id)}`}
                  >
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                ))}
                {activeTrip.friends.length > 4 && (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-shell text-xs font-semibold text-ink-soft ring-2 ring-canvas">
                    +{activeTrip.friends.length - 4}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {activeTrip.friends.length} {t("dashboard.friends")}
              </span>
            </div>
            <span className="rounded-full bg-shell px-3 py-1.5 text-sm font-semibold tabular-nums text-ink-soft">
              {t("ai.stops", { n: stopCount })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Create trip form ──────────────────────────────────── */}
      {showAddForm && (
        <section className="rounded-3xl border border-coast/25 bg-coast-wash/40 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg text-ink">{t("trips.newTrip")}</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="lp-focus cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-ink-faint hover:text-ink"
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
              className="lp-focus h-[42px] cursor-pointer rounded-full bg-sunset-deep px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("common.create")}
            </button>
          </form>
        </section>
      )}

      {/* ── Itinerary + trips ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Itinerary */}
        <section className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">{t("trips.schedule")}</h3>
              {stopCount > 0 && (
                <p className="mt-0.5 text-xs font-medium text-ink-faint">
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
                className="lp-focus cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold text-ink-faint transition-colors hover:bg-sunset-wash hover:text-sunset-ink"
              >
                {t("trips.clearSchedule")}
              </button>
            )}
          </div>

          {stopCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-coast-wash text-coast-deep">
                <FiCompass className="h-7 w-7" aria-hidden />
              </span>
              <h4 className="font-serif text-lg text-ink">{t("trips.emptyTitle")}</h4>
              <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
                {t("trips.emptyGoTo")} {t("trips.emptyGenerate")}
              </p>
              <Link
                href="/dashboard/ai"
                className="lp-focus mt-1 inline-flex items-center gap-1.5 rounded-full bg-sunset-deep px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {t("trips.emptyAiChat")} <FiArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <ol className="relative space-y-7">
              {/* rail */}
              <span
                className="pointer-events-none absolute bottom-3 left-[15px] top-3 w-px bg-line"
                aria-hidden
              />
              {days.map(({ day, items }) => (
                <li key={day} className="space-y-3">
                  {/* Day marker */}
                  <div className="relative flex items-center gap-3 pl-0">
                    <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold tabular-nums text-canvas ring-4 ring-canvas">
                      {day}
                    </span>
                    <h4 className="font-serif text-base text-ink">
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
                          className="group relative rounded-2xl border border-line bg-canvas-sink/50 p-3.5 transition-colors hover:border-coast/40"
                        >
                          {/* node on the rail */}
                          <span
                            className="absolute -left-[33px] top-5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-line transition-colors group-hover:bg-coast"
                            aria-hidden
                          />
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-ink-faint">
                                  <FiClock className="h-3.5 w-3.5" aria-hidden /> {act.time}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                                >
                                  <Icon className="h-3 w-3" aria-hidden />
                                  {t(`categories.${act.category}`)}
                                </span>
                              </div>
                              <h5 className="mt-1.5 text-sm font-semibold text-ink">
                                {act.title}
                              </h5>
                              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                                {act.description}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-sm font-semibold tabular-nums text-ink">
                                ${act.costEstimate}
                              </span>
                              <span className="block text-[10px] font-medium text-ink-faint">
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
        <section className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6 lg:self-start">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl text-ink">{t("trips.myTrips")}</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="lp-focus inline-flex cursor-pointer items-center gap-1 rounded-full bg-sunset-deep px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
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
                    className={`lp-focus flex cursor-pointer items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 transition-colors ${
                      isActive
                        ? "border-coast/40 bg-coast-wash/50"
                        : "border-line bg-transparent hover:bg-shell"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isActive ? "text-coast-deep" : "text-ink"
                        }`}
                      >
                        {trip.name}
                      </p>
                      <p className="truncate text-xs text-ink-faint">{trip.destination}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="lp-focus shrink-0 cursor-pointer rounded-md p-1.5 text-ink-faint transition-colors hover:bg-sunset-wash hover:text-sunset-ink"
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
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-coast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coast/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">{label}</span>
      {children}
    </label>
  );
}
