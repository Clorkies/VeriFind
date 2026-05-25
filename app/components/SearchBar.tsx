"use client";

import { useState } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <label className="relative block w-full max-w-3xl">
      <span className="sr-only">Search the board</span>

      <div
        className={`relative flex items-center gap-2 rounded-2xl border bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] transition-all duration-300 ${
          focused
            ? "border-[var(--color-accent)] shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <span className="pl-4 text-[var(--color-text-soft)]">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.6}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search the board — name, location, or description…"
          className="w-full bg-transparent py-3.5 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-soft)] outline-none sm:text-base"
        />
      </div>
    </label>
  );
}
