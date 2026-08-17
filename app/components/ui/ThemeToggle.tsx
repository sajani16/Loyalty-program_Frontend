"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="w-8 h-8 rounded-md flex items-center justify-center border border-border-subtle bg-surface hover:bg-surface-card transition-colors text-muted hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-brand" />
      ) : (
        <Moon className="w-4 h-4 text-foreground" />
      )}
    </button>
  );
}
