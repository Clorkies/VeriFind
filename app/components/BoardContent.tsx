"use client";

import { useMemo, useState } from "react";
import type { Item } from "@/lib/mockItems";
import { FilterPills, type FilterId } from "./FilterPills";
import { ItemCard } from "./ItemCard";
import { MasonryGrid } from "./MasonryGrid";
import { SearchBar } from "./SearchBar";
import { SkeletonCard } from "./SkeletonCard";

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
  items: Item[];
  showSkeleton: boolean;
};

export function BoardContent({ items, showSkeleton }: BoardContentProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    let list = items;
    if (filter === "resolved") {
      list = list.filter((i) => i.status === "resolved");
    } else if (filter !== "all") {
      list = list.filter((i) => i.category === filter);
    }
    const s = query.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s),
      );
    }
    return list;
  }, [items, filter, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-stretch gap-4 sm:items-center">
        <div className="flex w-full justify-center">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <FilterPills active={filter} onChange={setFilter} />
      </div>
      {showSkeleton ? (
        <MasonryGrid>
          {SKELETON_HEIGHTS.map((h, i) => (
            <SkeletonCard key={i} className={h} />
          ))}
        </MasonryGrid>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-text-subtle">
          No entries match this slice of the ledger.
        </p>
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
