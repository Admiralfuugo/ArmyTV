"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const themeEvent = "armytv-theme-change";
let sessionPreference: Theme | null = null;

function readPreference(): Theme | null {
  if (sessionPreference) return sessionPreference;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    document.documentElement.dataset.theme = readPreference() || (system.matches ? "dark" : "light");
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    sessionPreference = null;
    sync();
  };

  system.addEventListener("change", sync);
  window.addEventListener("storage", onStorage);
  window.addEventListener(themeEvent, onChange);
  return () => {
    system.removeEventListener("change", sync);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(themeEvent, onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(theme: Theme) {
  sessionPreference = theme;
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* Keep working when storage is unavailable. */ }
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(themeEvent));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "dark");

  return (
    <div className="theme-toggle" role="group" aria-label="Sayt ko‘rinishi">
      <span className="theme-toggle-thumb" aria-hidden="true" />
      <button type="button" className="theme-option theme-option-light" aria-label="Kunduzgi rejim" title="Kunduzgi rejim" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
        <Sun size={16} strokeWidth={1.8} aria-hidden="true" /><span>Kun</span>
      </button>
      <button type="button" className="theme-option theme-option-dark" aria-label="Tungi rejim" title="Tungi rejim" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
        <Moon size={15} strokeWidth={1.8} aria-hidden="true" /><span>Tun</span>
      </button>
    </div>
  );
}
