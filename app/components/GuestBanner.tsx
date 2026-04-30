"use client";

import { useEffect, useState } from "react";

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        className={`pointer-events-auto relative flex max-w-lg items-center gap-3 overflow-hidden rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] px-4 py-2.5 text-center text-sm text-[var(--color-text-soft)] shadow-[var(--color-card-shadow)] backdrop-blur-xl transition-all duration-700 ease-out ${
          mounted
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
        <p className="relative flex-1 leading-snug">
          Browsing as{" "}
          <span className="font-semibold text-[var(--color-accent)]">Guest</span>{" "}
          · Wallet required for claims.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="relative shrink-0 rounded-full p-1 text-[var(--color-text-soft)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text-primary)]"
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
