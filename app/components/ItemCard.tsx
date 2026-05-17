"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Item } from "@/lib/itemTypes";
import { truncateTxId } from "@/lib/mockItems";
import { useReveal } from "./useReveal";
import { useWallet } from "@/app/context/WalletProvider";
import { CheckCircle2, Loader2 } from "lucide-react";

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

export function ItemCard({ item: initialItem }: ItemCardProps) {
  const [item, setItem] = useState(initialItem);
  const [isClaiming, setIsClaiming] = useState(false);
  const { walletAddresses } = useWallet();
  
  const short = truncateTxId(item.txHash);
  const explorerUrl = `${EXPLORER_TX}${item.txHash}`;
  const ref = useReveal<HTMLElement>();
  const mediaAspect = pickMediaAspect(item.id);

  const isOwner = item.ownerAddress && 
    walletAddresses.map(a => a.toLowerCase()).includes(item.ownerAddress.toLowerCase());

  const handleClaim = async () => {
    setIsClaiming(true);
    // Simulate transaction to update metadata status to 'claimed'
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setItem(prev => ({ ...prev, status: "claimed" }));
    setIsClaiming(false);
    console.log(`Item ${item.id} claimed by owner ${item.ownerAddress}`);
  };

  return (
    <article
      ref={ref}
      className="group reveal lift surface-card relative overflow-hidden rounded-2xl transition-colors hover:border-[var(--color-accent)]"
    >
      <div className={`relative w-full overflow-hidden ${mediaAspect}`}>
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

        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          <StatusBadge status={item.status} />
          {isOwner && item.status === "found" && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md border border-emerald-500/30">
              Your Item
            </span>
          )}
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
        
        {isOwner && item.status === "found" ? (
          <div className="space-y-3 pt-2">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-300 leading-tight">
                This item&apos;s registered sticker address matches your wallet. You can claim it on-chain to update its status.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClaim}
              disabled={isClaiming}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating Ledger...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Claim this item
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] transition hover:text-[var(--color-accent)]"
            >
              <span>View Details</span>
              <span aria-hidden>→</span>
            </button>
            <Link
              href="/verify"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Scan owner QR
            </Link>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              aria-label="View on-chain report transaction"
            >
              On-chain ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
