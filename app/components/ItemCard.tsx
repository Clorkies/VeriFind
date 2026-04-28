import Image from "next/image";
import type { Item } from "@/lib/mockItems";
import { truncateTxId } from "@/lib/mockItems";

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
  if (status === "found") {
    return (
      <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
        Found
      </span>
    );
  }
  if (status === "claimed") {
    return (
      <span className="rounded-md bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-void-900 shadow-sm">
        Claimed
      </span>
    );
  }
  return (
    <span className="rounded-md bg-sky-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
      Resolved
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

  return (
    <article className="group glass relative overflow-hidden rounded-xl border-refraction/70 shadow-lg transition duration-300 hover:scale-[1.02] hover:border-maroon/30 hover:shadow-xl hover:backdrop-blur-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-refraction/40">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={`${item.name} photo`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center bg-gradient-to-br from-glass-700/80 to-void-900/90 backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-refraction bg-void-900/60 text-2xl font-bold text-text-subtle">
              ?
            </div>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="space-y-2 border-t border-refraction/50 bg-glass-700/25 p-4 backdrop-blur-sm">
        <h3 className="text-base font-bold text-text-primary">{item.name}</h3>
        <p className="text-xs leading-relaxed text-text-subtle">{item.location}</p>
        <div className="flex items-center gap-1.5 border-t border-refraction/40 pt-3 text-[11px] text-text-subtle">
          <MetadataIcon className="h-4 w-4 shrink-0 text-maroon-glow/90" />
          <span
            data-txid
            className="font-mono text-text-subtle transition group-hover:text-text-primary txid-hover-pulse"
          >
            {short}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            className="text-sm font-medium text-maroon transition hover:text-maroon-glow"
          >
            View Details
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-subtle underline-offset-2 transition hover:text-text-primary hover:underline"
          >
            Verify Proof
          </a>
        </div>
      </div>
    </article>
  );
}
