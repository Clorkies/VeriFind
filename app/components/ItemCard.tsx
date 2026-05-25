"use client";

import Image from "next/image";
import Link from "next/link";
import type { FoundItem } from "@/lib/itemTypes";
import { truncateTxId } from "@/lib/formatUtils";
import { useReveal } from "./useReveal";

function MetadataIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="4"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6 8h8M6 11h5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: FoundItem["status"] }) {
  const map = {
    available: {
      label: "Available",
      cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-border)]",
      dot: "bg-[var(--color-accent)]",
    },
    under_review: {
      label: "Under Review",
      cls: "bg-amber-500/15 text-amber-200 border-amber-500/30",
      dot: "bg-amber-400",
    },
    returned: {
      label: "Returned",
      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    unclaimed: {
      label: "Unclaimed",
      cls: "bg-slate-500/15 text-slate-300 border-slate-500/30",
      dot: "bg-slate-400",
    },
  } as const;
  const v = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${v.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
      {v.label}
    </span>
  );
}

type ItemCardProps = {
  item: FoundItem;
};

const EXPLORER_TX = "https://preprod.cardanoscan.io/transaction/";
const MEDIA_ASPECTS = [
  "aspect-[4/3]",
  "aspect-[3/2]",
  "aspect-[1/1]",
  "aspect-[5/4]",
  "aspect-[3/4]",
] as const;

function pickMediaAspect(seed: string) {
  const hash = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return MEDIA_ASPECTS[hash % MEDIA_ASPECTS.length];
}

export function ItemCard({ item }: ItemCardProps) {
  const short = truncateTxId(item.txHash);
  const explorerUrl = item.txHash ? `${EXPLORER_TX}${item.txHash}` : null;
  const ref = useReveal<HTMLElement>();
  const mediaAspect = pickMediaAspect(item.id);

  return (
    <article
      ref={ref}
      className="group reveal lift surface-card relative overflow-hidden rounded-2xl transition-colors hover:border-[var(--color-accent)]"
    >
      <div className={`relative w-full overflow-hidden ${mediaAspect}`}>
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={`${item.name} photo`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center bg-[var(--color-panel)]">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-2xl font-bold text-[var(--color-text-soft)]">
              ?
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-bg)]/85 to-transparent" />

        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="relative space-y-2 border-t border-[var(--color-border)] p-4">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          {item.name}
        </h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-soft)]">
          {item.locationFound}
        </p>
        <div className="flex items-center gap-1.5 border-t border-[var(--color-border)] pt-3 text-[11px]">
          <MetadataIcon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <span className="font-mono text-[var(--color-text-soft)]">
            {short}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Link
            href={`/claim/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] transition hover:text-[var(--color-accent)]"
          >
            <span>View Details</span>
            <span aria-hidden>→</span>
          </Link>
          
          {item.status === "available" ? (
            <Link
              href={`/claim/${item.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Claim Item
            </Link>
          ) : item.status === "under_review" ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300 border border-amber-500/20">
              Under Review
            </div>
          ) : item.status === "returned" ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400 border border-emerald-500/20">
              Returned ✓
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-500/20">
              Unclaimed
            </div>
          )}

          {explorerUrl ? (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              aria-label="View on-chain report transaction"
            >
              On-chain ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
