"use client";

import { useEffect, useRef, useSyncExternalStore, useMemo, type ReactNode } from "react";
import { X } from "lucide-react";

export function Brand({ small = false }: { small?: boolean }) {
  return <span className={`brand ${small ? "brand-small" : ""}`}>
    <span>Mudafaa<span className="brand-gold">Tv</span><span className="brand-dot">.</span></span>
  </span>;
}

export function Modal({ title, children, onClose, className = "" }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"], video[controls]');
    focusable()?.[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const nodes = focusable();
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={ref} className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
      <div className="modal-top"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Oynani yopish"><X size={21}/></button></div>
      {children}
    </div>
  </div>;
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("armtv-storage", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("armtv-storage", callback); };
};

export function useStoredState<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): [T, (value: T | ((old: T) => T)) => void] {
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(key); } catch { return null; } }, () => null);
  const value = useMemo(() => {
    try {
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return validate && !validate(parsed) ? fallback : parsed as T;
    } catch { return fallback; }
  }, [raw, fallback, validate]);
  function setValue(next: T | ((old: T) => T)) {
    try {
      const currentRaw = localStorage.getItem(key);
      let current = fallback;
      try {
        const parsed: unknown = currentRaw ? JSON.parse(currentRaw) : fallback;
        current = validate && !validate(parsed) ? fallback : parsed as T;
      } catch { /* A malformed saved value starts fresh. */ }
      const newValue = typeof next === "function" ? (next as (old: T) => T)(current) : next;
      localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(new Event("armtv-storage"));
    } catch { /* Browsers can disable local storage in private sessions. */ }
  }
  return [value, setValue];
}
