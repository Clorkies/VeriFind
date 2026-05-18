"use client";

import { useItems } from "@/app/context/ItemsProvider";
import { useParams, useRouter } from "next/navigation";
import { NavBar } from "@/app/components/NavBar";
import { Footer } from "@/app/components/Footer";
import { VerifyOwnershipPanel } from "@/app/components/VerifyOwnershipPanel";
import { ItemCard } from "@/app/components/ItemCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Item } from "@/lib/itemTypes";

export default function ClaimPage() {
  const { id } = useParams();
  const { items } = useItems();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const found = items.find((i) => i.id === id);
    if (found) {
      setItem(found);
    } else {
      // Small delay to account for potential loading/hydration
      const timer = setTimeout(() => {
        const refound = items.find((i) => i.id === id);
        if (!refound) router.push("/board");
        else setItem(refound);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [id, items, router]);

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />

      <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-10 pb-32 sm:px-6 lg:px-8">
        <Link
          href="/board"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-soft)] transition hover:text-[var(--color-accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ledger
        </Link>

        <header className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-text-soft)]">
              Verification Session
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Claiming <span className="text-[var(--color-accent)]">{item.name}</span>
          </h1>
          <p className="max-w-2xl text-sm text-[var(--color-text-soft)] sm:text-base">
            You are initiating a claim for this item. To prove ownership, please
            scan the VeriFind sticker attached to the physical object.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-soft)] px-1">
              Item Details
            </h3>
            <div className="pointer-events-none origin-top transition-all">
              <ItemCard item={item} />
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-soft)] leading-relaxed">
              <p>
                <strong>Security Note:</strong> The verification process is
                handled entirely on the client-side. Your wallet address is
                compared against the address encoded in the QR sticker. If they
                match, you can submit the claim transaction to the mock ledger.
              </p>
            </div>
          </div>

          <div className="panel-card rounded-2xl p-6 sm:p-8">
            <VerifyOwnershipPanel item={item} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
