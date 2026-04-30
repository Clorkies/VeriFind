"use client";

import Image from "next/image";
import type { Item } from "@/lib/mockItems";
import { truncateTxId } from "@/lib/mockItems";
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

function StatusBadge({ status }: { status: Item["status"] }) {
  const map = {
    found: {
      label: "Found",
      cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-border)]",
      dot: "bg-[var(--color-accent)]",
    },
    claimed: {
      label: "Claimed",
      cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-border)]",
      dot: "bg-[var(--color-accent)]",
    },
    resolved: {
      label: "Resolved",
      cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-border)]",
      dot: "bg-[var(--color-accent)]",
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
  item: Item;
};

const EXPLORER_TX = "https://preprod.cardanoscan.io/transaction/";

export function ItemCard({ item }: ItemCardProps) {
  const short = truncateTxId(item.txHash);
  const explorerUrl = `${EXPLORER_TX}${item.txHash}`;
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      className="group reveal lift surface-card relative overflow-hidden rounded-2xl transition-colors hover:border-[var(--color-accent)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
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

        <div className="absolute right-3 top-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="relative space-y-2 border-t border-[var(--color-border)] p-4">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          {item.name}
        </h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-soft)]">
          {item.location}
        </p>
        <div className="flex items-center gap-1.5 border-t border-[var(--color-border)] pt-3 text-[11px]">
          <MetadataIcon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <span className="font-mono text-[var(--color-text-soft)]">
            {short}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] transition hover:text-[var(--color-accent)]"
          >
            <span>View Details</span>
            <span aria-hidden>→</span>
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 2H2v8h8V8M7 2h3v3M5 7l5-5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verify Proof
          </a>
        </div>
      </div>
    </article>
  );
}
