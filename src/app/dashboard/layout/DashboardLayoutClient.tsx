"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBriefcase, FiCpu, FiDollarSign, FiLogOut, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useDashboard } from "./DashboardContext";
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
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-sunset-deep" />
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
            className="lp-focus flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
          >
            <Logo size={30} className="!rounded-lg !shadow-none" />
            <span className="font-serif text-2xl leading-none text-ink">triplit</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lp-focus cursor-pointer rounded-lg p-1.5 text-ink-faint hover:bg-shell hover:text-ink lg:hidden"
            aria-label={t("common.cancel")}
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Trip selector */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="trip-selector"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint"
          >
            {t("dashboard.activeTrip")}
          </label>
          <div className="relative">
            <select
              id="trip-selector"
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-line bg-canvas px-3 py-2.5 pr-9 text-sm font-semibold text-ink transition-colors focus:border-coast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coast/30"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
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
                className={`lp-focus flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-ink text-canvas"
                    : "text-ink-soft hover:bg-shell hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User + sign out */}
      <div className="mt-auto border-t border-line p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunset text-xs font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-faint">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="lp-focus flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-sunset/40 hover:bg-sunset-wash hover:text-sunset-ink"
        >
          <FiLogOut className="h-3.5 w-3.5" aria-hidden /> {t("dashboard.logOut")}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2">
          <Logo size={26} className="!rounded-lg !shadow-none" />
          <span className="font-serif text-xl leading-none text-ink">triplit</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => setSidebarOpen(true)}
            className="lp-focus cursor-pointer rounded-lg border border-line bg-canvas p-2 text-ink-soft"
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
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-canvas-sink">
            <div className="flex items-center justify-end gap-2 px-5 pt-4">
              <LanguageToggle />
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-canvas-sink/70 lg:flex">
        <div className="flex items-center justify-end gap-2 px-5 pt-4">
          <LanguageToggle />
        </div>
        {sidebarContent}
      </aside>

      {/* Main workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-12 pt-[68px] sm:px-6 lg:px-8 lg:pt-8">
          {/* Page header */}
          <header className="mb-7 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs font-medium text-ink-faint"
              >
                <span>{t("dashboard.workspace")}</span>
                <span aria-hidden>/</span>
                <span className="truncate font-semibold text-coast-deep">
                  {activeTrip.name}
                </span>
              </nav>
              <h1 className="mt-1.5 font-serif text-[1.7rem] leading-tight tracking-[-0.01em] text-ink sm:text-3xl">
                {pageTitle}
              </h1>
            </div>

            {/* Trip stats */}
            <div className="flex items-center divide-x divide-line">
              <div className="pr-5">
                <p className="text-xs font-medium text-ink-faint">
                  {t("dashboard.totalCost")}
                </p>
                <p className="mt-0.5 font-serif text-xl tabular-nums text-sunset-ink">
                  ${totalBudget.toFixed(2)}
                </p>
              </div>
              <div className="pl-5">
                <p className="text-xs font-medium text-ink-faint">
                  {t("dashboard.friends")}
                </p>
                <p className="mt-0.5 font-serif text-xl tabular-nums text-ink">
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
