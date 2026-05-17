"use client";

import { useState } from "react";
import { Item, ItemCategory, ItemStatus } from "@/lib/itemTypes";
import { ItemCard } from "./ItemCard";

export function AdminItemForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("electronics");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<ItemStatus>("found");
  const [picSeed, setPicSeed] = useState("");
  const [foundAt, setFoundAt] = useState(new Date().toISOString().slice(0, 16));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const previewItem: Item = {
    id: "preview",
    name: name || "Item Name Preview",
    category,
    location: location || "Location Preview",
    status,
    imageUrl: picSeed ? `https://picsum.photos/seed/${picSeed}/480/320` : null,
    txHash: "0000000000000000000000000000000000000000000000000000000000000000",
    foundAt: new Date(foundAt).toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Creating item:", {
      name,
      category,
      location,
      status,
      picSeed,
      foundAt: new Date(foundAt).toISOString(),
    });

    setMessage({
      type: "success",
      text: `Successfully registered "${name}" on the mock ledger!`,
    });
    
    // Reset form
    setName("");
    setLocation("");
    setPicSeed("");
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 panel-card rounded-2xl p-6 sm:p-8 animate-fade-up">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Register New Item</h2>
          <p className="text-sm text-[var(--color-text-soft)]">
            Record a new found or lost item on the decentralized ledger.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-primary)]">
                Item Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Blue Backpack"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-[var(--color-text-primary)]">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="valuables">Valuables</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="location" className="text-sm font-medium text-[var(--color-text-primary)]">
                Location Description
              </label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Found at: N-Building / Cafeteria"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-[var(--color-text-primary)]">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <option value="found">Found</option>
                <option value="claimed">Claimed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="foundAt" className="text-sm font-medium text-[var(--color-text-primary)]">
                Date & Time
              </label>
              <input
                id="foundAt"
                type="datetime-local"
                required
                value={foundAt}
                onChange={(e) => setFoundAt(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="picSeed" className="text-sm font-medium text-[var(--color-text-primary)]">
                Image Seed (Optional)
              </label>
              <input
                id="picSeed"
                type="text"
                value={picSeed}
                onChange={(e) => setPicSeed(e.target.value)}
                placeholder="e.g. vf-backpack (used for picsum seed)"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Processing Transaction..." : "Submit to Ledger"}
          </button>
        </form>
      </div>

      <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-soft)] px-1">
          Live Preview
        </h3>
        <div className="pointer-events-none opacity-80 scale-95 origin-top transition-all">
          <ItemCard item={previewItem} />
        </div>
        <p className="text-[10px] text-[var(--color-text-soft)] px-2 italic">
          * This is how the item will appear on the public bulletin board after the transaction is confirmed on-chain.
        </p>
      </div>
    </div>
  );
}
