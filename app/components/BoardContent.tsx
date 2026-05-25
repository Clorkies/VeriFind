"use client";

import { useMemo, useState } from "react";
import { FilterPills, type FilterId } from "./FilterPills";
import { ItemCard } from "./ItemCard";
import { MasonryGrid } from "./MasonryGrid";
import { SearchBar } from "./SearchBar";
import { SkeletonCard } from "./SkeletonCard";
import { useItems } from "@/app/context/ItemsProvider";

const SKELETON_HEIGHTS = [
  "h-52",
  "h-60",
  "h-48",
  "h-56",
  "h-64",
  "h-50",
  "h-58",
  "h-54",
  "h-55",
  "h-59",
  "h-51",
  "h-57",
];

type BoardContentProps = {
  showSkeleton: boolean;
};

export function BoardContent({ showSkeleton: initialShowSkeleton }: BoardContentProps) {
  const { items, loading } = useItems();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("open");

  const showSkeleton = initialShowSkeleton || loading;

  const filtered = useMemo(() => {
    let list = items;
    if (filter === "open") {
      list = list.filter(
        (i) => i.status === "available" || i.status === "under_review",
      );
    } else if (filter !== "all") {
      list = list.filter((i) => i.status === filter);
    }
    const s = query.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.locationFound.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          (i.txHash ? i.txHash.toLowerCase().includes(s) : false),
      );
    }
    return list;
  }, [items, filter, query]);

  return (
    <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-10 pb-32 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-10 space-y-4">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-xs font-medium tracking-wide text-[var(--color-text-soft)]">
            Campus Registry · {items.length} entries
          </span>
        </div>
        <h1
          className="animate-fade-up text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          style={{ animationDelay: "0.05s" }}
        >
          Lost & Found <span className="text-[var(--color-accent)]">Board</span>
        </h1>
        <p
          className="animate-fade-up max-w-2xl text-sm text-[var(--color-text-soft)] sm:text-base"
          style={{ animationDelay: "0.15s" }}
        >
          Browse items logged by the Lost & Found office. Submit a claim with your
          Student ID and a description for staff verification.
        </p>
      </header>

      <div
        className="animate-fade-up mb-8 flex flex-col items-stretch gap-4 sm:items-center"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex w-full justify-center">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <FilterPills active={filter} onChange={setFilter} />
        <div className="text-xs text-[var(--color-text-soft)]">
          Showing{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">
            {filtered.length}
          </span>{" "}
          of {items.length}
        </div>
      </div>

      {showSkeleton ? (
        <MasonryGrid>
          {SKELETON_HEIGHTS.map((h, i) => (
            <SkeletonCard key={i} className={h} />
          ))}
        </MasonryGrid>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="panel-card relative flex h-20 w-20 items-center justify-center rounded-2xl">
            <span className="text-2xl text-[var(--color-text-soft)]">∅</span>
          </div>
          <p className="text-[var(--color-text-soft)]">
            No entries match this filter yet.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("open");
            }}
            className="mt-1 text-sm text-[var(--color-accent)] underline-offset-4 transition hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <MasonryGrid>
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </MasonryGrid>
      )}
    </main>
  );
}
