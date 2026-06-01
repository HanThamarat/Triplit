"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBriefcase, FiCpu, FiDollarSign, FiLogOut, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useDashboard } from "./DashboardContext";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageToggle from "../../components/LanguageToggle";
import Logo from "../../components/Logo";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/i18n/LanguageProvider";

interface DashboardLayoutClientProps {
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const {
    trips,
    selectedTripId,
    setSelectedTripId,
    activeTrip,
    sidebarOpen,
    setSidebarOpen,
  } = useDashboard();

  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pearl-border border-t-blue-primary dark:border-obsidian-border dark:border-t-gold" />
      </div>
    );
  }

  const totalBudget = activeTrip.expenses.reduce((acc, ex) => acc + ex.amount, 0);

  const signOut = async () => {
    const data = await authClient.signOut({});
    if (data.data?.success) {
      router.push("/authentication");
    }
  };

  const navItems = [
    { path: "/dashboard", icon: FiBriefcase, label: t("dashboard.tabTrips") },
    { path: "/dashboard/ai", icon: FiCpu, label: t("dashboard.tabAi") },
    { path: "/dashboard/expenses", icon: FiDollarSign, label: t("dashboard.tabBills") },
  ];

  const pageTitle =
    pathname === "/dashboard"
      ? t("dashboard.titleTrips")
      : pathname === "/dashboard/ai"
      ? t("dashboard.titleAi")
      : t("dashboard.titleExpenses");

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-6 p-5">
        {/* Brand row */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold"
          >
            <Logo size={30} />
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-stone-100">
              triplit
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-pearl-surface dark:text-stone-400 dark:hover:bg-obsidian-elevated lg:hidden cursor-pointer"
            aria-label={t("common.cancel")}
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Trip selector */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="trip-selector"
            className="text-xs font-semibold text-slate-500 dark:text-stone-400"
          >
            {t("dashboard.activeTrip")}
          </label>
          <div className="relative">
            <select
              id="trip-selector"
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-pearl-border bg-pearl-surface px-3 py-2.5 pr-9 text-sm font-semibold text-slate-800 transition-colors focus:border-blue-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary/30 dark:border-obsidian-border dark:bg-obsidian dark:text-stone-200 dark:focus:border-gold dark:focus-visible:ring-gold/30"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-stone-500"
              aria-hidden
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1" aria-label={t("dashboard.workspace")}>
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary dark:focus-visible:ring-gold ${
                  isActive
                    ? "bg-blue-primary text-white shadow-sm dark:bg-gold dark:text-obsidian"
                    : "text-slate-600 hover:bg-pearl-surface hover:text-slate-900 dark:text-stone-400 dark:hover:bg-obsidian-elevated dark:hover:text-stone-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User + sign out */}
      <div className="mt-auto border-t border-pearl-border p-5 dark:border-obsidian-border">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-primary to-blue-light text-xs font-bold text-white dark:from-gold dark:to-ember dark:text-obsidian">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-stone-200">{user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-stone-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-pearl-border px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-accent/40 hover:bg-rose-accent/10 hover:text-rose-accent dark:border-obsidian-border dark:text-stone-400 dark:hover:text-rose-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-accent cursor-pointer"
        >
          <FiLogOut className="h-3.5 w-3.5" aria-hidden /> {t("dashboard.logOut")}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-pearl font-sans text-slate-900 dark:bg-obsidian dark:text-stone-100">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-pearl-border bg-pearl-card/95 px-4 py-3 backdrop-blur-sm dark:border-obsidian-border dark:bg-obsidian-card/95 lg:hidden">
        <div className="flex items-center gap-2">
          <Logo size={26} />
          <span className="font-display text-base font-extrabold tracking-tight text-slate-900 dark:text-stone-100">
            triplit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-pearl-border bg-pearl-card p-2 text-slate-600 dark:border-obsidian-border dark:bg-obsidian-card dark:text-stone-300 cursor-pointer"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-pearl-border bg-pearl-card dark:border-obsidian-border dark:bg-obsidian-card">
            {/* Toggles live in the mobile top bar; surface them in the drawer too */}
            <div className="flex items-center justify-end gap-2 px-5 pt-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-pearl-border bg-pearl-card dark:border-obsidian-border dark:bg-obsidian-card lg:flex">
        <div className="flex items-center justify-end gap-2 px-5 pt-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        {sidebarContent}
      </aside>

      {/* Main workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-10 pt-[68px] sm:px-6 lg:px-8 lg:pt-8">
          {/* Page header */}
          <header className="mb-6 flex flex-col gap-4 border-b border-pearl-border pb-5 dark:border-obsidian-border sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-stone-400"
              >
                <span>{t("dashboard.workspace")}</span>
                <span aria-hidden>/</span>
                <span className="truncate font-semibold text-blue-dark dark:text-gold">
                  {activeTrip.name}
                </span>
              </nav>
              <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-stone-50 sm:text-[1.7rem]">
                {pageTitle}
              </h1>
            </div>

            {/* Trip stats */}
            <div className="flex items-center divide-x divide-pearl-border dark:divide-obsidian-border">
              <div className="pr-5">
                <p className="text-xs font-medium text-slate-500 dark:text-stone-400">
                  {t("dashboard.totalCost")}
                </p>
                <p className="mt-0.5 text-lg font-extrabold tabular-nums text-ember">
                  ${totalBudget.toFixed(2)}
                </p>
              </div>
              <div className="pl-5">
                <p className="text-xs font-medium text-slate-500 dark:text-stone-400">
                  {t("dashboard.friends")}
                </p>
                <p className="mt-0.5 text-lg font-extrabold tabular-nums text-slate-900 dark:text-stone-100">
                  {activeTrip.friends.length}
                </p>
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
