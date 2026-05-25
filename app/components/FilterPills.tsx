"use client";

export type FilterId =
  | "open"
  | "all"
  | "available"
  | "under_review"
  | "returned"
  | "unclaimed";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "available", label: "Available" },
  { id: "under_review", label: "Under Review" },
  { id: "returned", label: "Returned" },
  { id: "unclaimed", label: "Unclaimed" },
  { id: "all", label: "All" },
];

type FilterPillsProps = {
  active: FilterId;
  onChange: (id: FilterId) => void;
};

export function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
              isActive
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] text-[var(--color-text-soft)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <span className="relative">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
