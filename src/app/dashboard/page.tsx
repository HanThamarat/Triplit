"use client";

import Link from "next/link";
import { FiCalendar, FiMapPin, FiPlus, FiTrash2, FiClock, FiCpu } from "react-icons/fi";
import { useDashboard } from "./layout/DashboardContext";

export default function DashboardPage() {
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary dark:border-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Active Trip */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-bl from-blue-primary/[0.06] dark:from-gold/[0.06] to-transparent rounded-bl-full pointer-events-none" />
          <span className="px-2.5 py-0.5 rounded-full bg-blue-subtle dark:bg-gold/10 border border-blue-primary/20 dark:border-gold/20 text-blue-primary dark:text-gold font-bold text-[9px] uppercase tracking-wider">
            Active Schedule
          </span>
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-stone-50 mt-3 flex items-center gap-2">
            <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-ember" /> {activeTrip.destination}
          </h2>
          <p className="text-xs text-pearl-muted dark:text-obsidian-muted mt-1.5 flex items-center gap-1.5 font-medium">
            <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {activeTrip.dates}
          </p>
          <p className="text-xs text-pearl-muted dark:text-obsidian-muted mt-3 max-w-xl leading-relaxed">
            Invite friends, log expenses, and use the AI assistant to design day-by-day sightseeing programs.
          </p>
        </div>

        {/* Trip List */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-display font-bold text-xs text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">My Trips</h4>
            <button
              onClick={() => setShowAddForm(true)}
              className="p-1 rounded bg-blue-primary dark:bg-gold text-white dark:text-obsidian hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
              title="Add new trip"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2 flex-1 max-h-[120px] overflow-y-auto pr-1">
            {trips.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTripId(t.id)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  t.id === selectedTripId
                    ? "border-blue-primary/30 dark:border-gold/30 bg-blue-subtle dark:bg-gold/[0.05] text-blue-primary dark:text-gold"
                    : "border-pearl-border dark:border-obsidian-border bg-pearl-surface/50 dark:bg-obsidian-elevated/50 text-pearl-muted dark:text-obsidian-muted hover:bg-pearl-surface"
                }`}
              >
                <span>{t.name}</span>
                <button
                  onClick={(e) => handleDeleteTrip(t.id, e)}
                  className="text-pearl-muted hover:text-rose-accent p-0.5 rounded transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Trip Form */}
      {showAddForm && (
        <div className="p-5 sm:p-6 rounded-2xl border border-blue-primary/20 dark:border-gold/20 bg-blue-subtle/50 dark:bg-gold/[0.03] shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-stone-50">New Trip</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold text-pearl-muted hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateTrip} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[9px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Trip Name</label>
              <input
                required
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="e.g. Euro Summer 2026"
                className="w-full mt-1 bg-pearl-card dark:bg-obsidian-surface text-slate-800 dark:text-stone-100 rounded-lg px-3 py-2 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Destination</label>
              <input
                required
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="e.g. Rome, Italy"
                className="w-full mt-1 bg-pearl-card dark:bg-obsidian-surface text-slate-800 dark:text-stone-100 rounded-lg px-3 py-2 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Dates</label>
                <input
                  value={newDates}
                  onChange={(e) => setNewDates(e.target.value)}
                  placeholder="e.g. Aug 10-20"
                  className="w-full mt-1 bg-pearl-card dark:bg-obsidian-surface text-slate-800 dark:text-stone-100 rounded-lg px-3 py-2 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-primary dark:bg-gold text-white dark:text-obsidian font-bold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all shadow cursor-pointer self-end"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Itinerary Timeline */}
      <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 border-b border-pearl-border/50 dark:border-obsidian-border/50 pb-3 gap-2">
          <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-stone-50">Trip Schedule</h3>
          {activeTrip.itinerary.length > 0 && (
            <button
              onClick={() => {
                const updated = trips.map((t) => (t.id === selectedTripId ? { ...t, itinerary: [] } : t));
                saveTrips(updated);
              }}
              className="text-[10px] font-bold text-rose-accent hover:text-rose-muted uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              Clear Schedule
            </button>
          )}
        </div>

        {activeTrip.itinerary.length === 0 ? (
          <div className="text-center py-12 sm:py-20 text-pearl-muted dark:text-obsidian-muted text-xs">
            <FiCpu className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-primary dark:text-gold animate-bounce" />
            Your schedule is empty.
            <br />
            Go to the{" "}
            <Link
              href="/dashboard/ai"
              className="text-blue-primary dark:text-gold cursor-pointer hover:underline font-bold"
            >
              AI Chat
            </Link>{" "}
            page to generate one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {activeTrip.itinerary.map((act, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl border border-pearl-border dark:border-obsidian-border/60 bg-pearl-surface/50 dark:bg-obsidian-elevated/40 flex flex-col gap-2 hover:border-blue-primary/20 dark:hover:border-gold/20 transition-all duration-200"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Day {act.day} • {act.time}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded border uppercase tracking-wider text-[8px] ${
                      act.category === "dining"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                        : act.category === "activity"
                        ? "bg-blue-subtle dark:bg-gold/10 border-blue-primary/20 dark:border-gold/20 text-blue-primary dark:text-gold"
                        : "bg-luxe/10 border-luxe/20 text-luxe"
                    }`}
                  >
                    {act.category}
                  </span>
                </div>
                <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-800 dark:text-stone-200 mt-0.5">
                  {act.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-pearl-muted dark:text-obsidian-muted leading-relaxed">
                  {act.description}
                </p>
                <div className="border-t border-pearl-border/40 dark:border-obsidian-border/30 pt-2 mt-auto flex justify-between items-center text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">
                  <span>Estimated</span>
                  <span className="text-slate-900 dark:text-stone-50">${act.costEstimate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}