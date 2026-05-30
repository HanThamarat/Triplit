"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBriefcase, FiCpu, FiDollarSign, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useDashboard } from "./DashboardContext";
import ThemeToggle from "../../components/ThemeToggle";
import Logo from "../../components/Logo";
import { authClient } from "@/lib/auth-client";

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

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary dark:border-gold" />
      </div>
    );
  }

  // Calculate totals
  const totalBudget = activeTrip.expenses.reduce((acc, ex) => acc + ex.amount, 0);

  const signOut = async () => {
    const data = await authClient.signOut({
      fetchOptions: () => {
        router.push("/authentication");
      }
    });

    if (data.data?.success) {
      router.push("/authentication");
    }
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size={32} />
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-stone-100">
              triplit
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Close button on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg border border-pearl-border dark:border-obsidian-border text-pearl-muted dark:text-obsidian-muted cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trip Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">
            Active Trip
          </label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="w-full bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-200 rounded-lg px-2.5 py-2 text-xs border border-pearl-border dark:border-obsidian-border font-semibold focus:outline-none focus:border-blue-primary dark:focus:border-gold transition-all cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation */}
        <nav className="flex flex-col gap-1.5 mt-1">
          {[
            { path: "/dashboard", icon: FiBriefcase, label: "Trips Planner" },
            { path: "/dashboard/ai", icon: FiCpu, label: "AI Chat" },
            { path: "/dashboard/expenses", icon: FiDollarSign, label: "Shared Bills" },
          ].map(({ path, icon: Icon, label }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-blue-primary dark:bg-gold text-white dark:text-obsidian shadow-md font-bold"
                    : "text-pearl-muted dark:text-obsidian-muted hover:bg-pearl-surface dark:hover:bg-obsidian-elevated hover:text-slate-800 dark:hover:text-stone-200"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom user */}
      <div className="p-4 sm:p-5 border-t border-pearl-border dark:border-obsidian-border bg-pearl-surface/50 dark:bg-obsidian/30 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-primary to-blue-light dark:from-gold dark:to-ember flex items-center justify-center font-bold text-xs text-white dark:text-obsidian">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate flex-1">
            <h4 className="font-bold text-xs text-slate-800 dark:text-stone-200 truncate">{user.name}</h4>
            <p className="text-[9.5px] text-pearl-muted dark:text-obsidian-muted truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full py-2 px-3 rounded-lg border border-pearl-border dark:border-obsidian-border hover:bg-rose-accent/10 hover:border-rose-accent/30 text-pearl-muted hover:text-rose-accent dark:hover:text-rose-accent transition-all text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <FiLogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-slate-900 dark:text-stone-100 flex font-sans transition-colors duration-300">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 glass-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-stone-100">
            triplit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card text-slate-600 dark:text-stone-300 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-pearl-card dark:bg-obsidian-card border-r border-pearl-border dark:border-obsidian-border flex flex-col justify-between z-10 animate-text-reveal">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card flex-col justify-between flex-shrink-0 z-10">
        {sidebarContent}
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 h-[100vh] mt-[20px] sm:mt-[55px] lg:mt-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative pt-16 lg:pt-6">
        {/* Decorative glow */}
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-primary/[0.03] dark:bg-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-pearl-border dark:border-obsidian-border gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-widest">
              <span>Workspace</span> /{" "}
              <span className="text-blue-primary dark:text-gold font-extrabold">{activeTrip.name}</span>
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-stone-50 mt-1">
              {pathname === "/dashboard" && "Trips Planner Hub"}
              {pathname === "/dashboard/ai" && "AI Travel Assistant"}
              {pathname === "/dashboard/expenses" && "Shared Expense Ledger"}
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <span className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">
                Total Cost
              </span>
              <h3 className="font-black text-sm text-ember">${totalBudget.toFixed(2)}</h3>
            </div>
            <div className="h-8 w-[1px] bg-pearl-border dark:bg-obsidian-border" />
            <div className="text-right">
              <span className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">
                Friends
              </span>
              <h3 className="font-black text-sm text-slate-800 dark:text-stone-100">{activeTrip.friends.length}</h3>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
