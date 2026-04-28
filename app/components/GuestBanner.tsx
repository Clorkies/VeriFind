"use client";

import { useState } from "react";

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto glass-strong flex max-w-lg items-center gap-3 rounded-full border-gold/30 px-4 py-2.5 text-center text-sm text-gold shadow-lg">
        <p className="flex-1 leading-snug">
          Browsing as a Guest. Wallet required for claims.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 text-gold/80 transition hover:bg-refraction/50 hover:text-gold"
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
