"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block w-full max-w-3xl">
      <span className="sr-only">Search the Ledger</span>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the Ledger"
        className="w-full rounded-xl border border-refraction bg-glass-700/50 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle/70 outline-none ring-maroon/30 transition focus:border-maroon/50 focus:ring-2"
      />
    </label>
  );
}
