"use client";

import type { ItemCategory } from "@/lib/mockItems";

export type FilterId = "all" | ItemCategory | "resolved";

const FILTERS: {
  id: FilterId;
  label: string;
  dot: "green" | "blue";
}[] = [
  { id: "electronics", label: "Electronics", dot: "green" },
  { id: "books", label: "Books", dot: "green" },
  { id: "valuables", label: "Valuables", dot: "green" },
  { id: "resolved", label: "Resolved Cases", dot: "blue" },
];

function Dot({ variant }: { variant: "green" | "blue" }) {
  const cls =
    variant === "green"
      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      : "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.45)]";
  return <span className={`h-2 w-2 shrink-0 rounded-full ${cls}`} aria-hidden />;
}

type FilterPillsProps = {
  active: FilterId;
  onChange: (id: FilterId) => void;
};

export function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
          active === "all"
            ? "border-maroon/60 bg-maroon/20 text-text-primary"
            : "border-refraction/80 bg-glass-700/30 text-text-subtle hover:border-refraction hover:text-text-primary"
        }`}
      >
        All
      </button>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
            active === f.id
              ? "border-maroon/60 bg-maroon/20 text-text-primary"
              : "border-refraction/80 bg-glass-700/30 text-text-subtle hover:border-refraction hover:text-text-primary"
          }`}
        >
          <Dot variant={f.dot} />
          {f.label}
        </button>
      ))}
    </div>
  );
}
