"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("triplit_theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("triplit_theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative p-2 rounded-xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer group focus:outline-none"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun */}
        <FiSun
          className={`w-5 h-5 text-gold absolute transition-all duration-500 transform ${
            theme === "light"
              ? "translate-y-0 rotate-0 opacity-100 scale-100"
              : "translate-y-6 rotate-90 opacity-0 scale-75"
          }`}
        />
        {/* Moon */}
        <FiMoon
          className={`w-5 h-5 text-gold-light absolute transition-all duration-500 transform ${
            theme === "dark"
              ? "translate-y-0 rotate-0 opacity-100 scale-100"
              : "-translate-y-6 -rotate-90 opacity-0 scale-75"
          }`}
        />
      </div>

      {/* Glow ring on dark mode */}
      {theme === "dark" && (
        <div className="absolute inset-0 rounded-xl border border-gold/10 pointer-events-none" />
      )}

      {/* Tooltip */}
      <span className="absolute top-12 right-0 scale-0 group-hover:scale-100 rounded-lg bg-obsidian-card dark:bg-pearl-card text-pearl-card dark:text-obsidian px-2.5 py-1 text-[10px] font-medium transition-all duration-150 origin-top shadow-lg pointer-events-none whitespace-nowrap border border-obsidian-border dark:border-pearl-border z-50">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
