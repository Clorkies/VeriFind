"use client";

import { useMemo, useState } from "react";
import type { ClaimRequest, FoundItem, ItemCategory } from "@/lib/itemTypes";
import { ItemCard } from "./ItemCard";
import { useItems } from "@/app/context/ItemsProvider";

const ADMIN_ID = "admin-001";

export function AdminItemForm() {
  const { items, claims, loading, logItem, approveClaim, rejectClaim, releaseItem } =
    useItems();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hiddenDescription, setHiddenDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("electronics");
  const [locationFound, setLocationFound] = useState("");
  const [dateFound, setDateFound] = useState(new Date().toISOString().slice(0, 16));
  const [photoInput, setPhotoInput] = useState("");
  const [custodyStatus, setCustodyStatus] = useState<"held" | "released">("held");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [claimAction, setClaimAction] = useState<
    Record<string, "approving" | "rejecting" | null>
  >({});
  const [releaseAction, setReleaseAction] = useState<Record<string, boolean>>({});

  const getPhotoUrl = (input: string) => {
    if (!input) return undefined;
    if (input.startsWith("http")) return input;
    return `https://loremflickr.com/480/320/${encodeURIComponent(input)}`;
  };

  const previewItem: FoundItem = {
    id: "preview",
    name: name || "Item Name Preview",
    description: description || "Description preview for the item.",
    hiddenDescription: hiddenDescription || "Hidden details preview.",
    category,
    locationFound: locationFound || "Location Preview",
    dateFound: new Date(dateFound).toISOString(),
    photoUrl: getPhotoUrl(photoInput),
    status: custodyStatus === "released" ? "returned" : "available",
    custodyStatus,
    loggedBy: ADMIN_ID,
    loggedAt: new Date().toISOString(),
    auditLog: [],
  };

  const claimQueue = useMemo(() => {
    const byItem = new Map<string, ClaimRequest[]>();
    claims.forEach((claim) => {
      const list = byItem.get(claim.itemId) ?? [];
      list.push(claim);
      byItem.set(claim.itemId, list);
    });
    return Array.from(byItem.entries());
  }, [claims]);

  const itemsById = useMemo(() => {
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await logItem({
        name: name.trim(),
        description: description.trim(),
        hiddenDescription: hiddenDescription.trim(),
        category,
        locationFound: locationFound.trim(),
        dateFound: new Date(dateFound).toISOString(),
        photoUrl: getPhotoUrl(photoInput),
        loggedBy: ADMIN_ID,
        custodyStatus,
      });

      if (result.anchorError) {
        setMessage({
          type: "warning",
          text: `Logged "${name}" but on-chain anchoring failed: ${result.anchorError}`,
        });
      } else if (result.txHash) {
        setMessage({
          type: "success",
          text: `Logged "${name}" with on-chain record ${result.txHash}.`,
        });
      } else {
        setMessage({
          type: "success",
          text: `Logged "${name}" in the registry.`,
        });
      }

      setName("");
      setDescription("");
      setHiddenDescription("");
      setLocationFound("");
      setPhotoInput("");
      setCustodyStatus("held");
    } catch (error) {
      console.error("Failed to log item:", error);
      setMessage({
        type: "error",
        text: "Failed to log item. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (claimId: string) => {
    setMessage(null);
    setActionMessage(null);
    setClaimAction((prev) => ({ ...prev, [claimId]: "approving" }));
    try {
      await approveClaim(claimId, ADMIN_ID, reviewNotes[claimId]);
      setActionMessage({
        type: "success",
        text: "Claim approved. On-chain anchor submitted.",
      });
    } catch (error) {
      console.error("Failed to approve claim:", error);
      const text = error instanceof Error ? error.message : "Failed to approve claim.";
      setActionMessage({ type: "error", text });
      alert(text);
    } finally {
      setClaimAction((prev) => ({ ...prev, [claimId]: null }));
    }
  };

  const handleReject = async (claimId: string) => {
    setMessage(null);
    setActionMessage(null);
    setClaimAction((prev) => ({ ...prev, [claimId]: "rejecting" }));
    try {
      await rejectClaim(
        claimId,
        ADMIN_ID,
        reviewNotes[claimId] ?? "Rejected by admin.",
      );
      setActionMessage({
        type: "success",
        text: "Claim rejected.",
      });
    } catch (error) {
      console.error("Failed to reject claim:", error);
      const text = error instanceof Error ? error.message : "Failed to reject claim.";
      setActionMessage({ type: "error", text });
      alert(text);
    } finally {
      setClaimAction((prev) => ({ ...prev, [claimId]: null }));
    }
  };

  const handleRelease = async (itemId: string) => {
    setMessage(null);
    setActionMessage(null);
    setReleaseAction((prev) => ({ ...prev, [itemId]: true }));
    try {
      await releaseItem(itemId, ADMIN_ID);
      setActionMessage({
        type: "success",
        text: "Item marked as released.",
      });
    } catch (error) {
      console.error("Failed to release item:", error);
      const text = error instanceof Error ? error.message : "Failed to release item.";
      setActionMessage({ type: "error", text });
      alert(text);
    } finally {
      setReleaseAction((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 panel-card rounded-2xl p-6 sm:p-8 animate-fade-up">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Log New Item</h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Record a found item and attach it to the public board.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Item Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Blue Backpack"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value as ItemCategory)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="valuables">Valuables</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Public Item Description
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Visible on the board: Color, brand, markings, condition"
                  rows={2}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="hiddenDescription"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Private Verification Details (Staff Only)
                </label>
                <textarea
                  id="hiddenDescription"
                  value={hiddenDescription}
                  onChange={(event) => setHiddenDescription(event.target.value)}
                  placeholder="Hidden from board: Serial number, contents of bag, lock screen photo description, etc."
                  rows={2}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-blue-500/5 px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="locationFound"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Location Found
                </label>
                <input
                  id="locationFound"
                  type="text"
                  required
                  value={locationFound}
                  onChange={(event) => setLocationFound(event.target.value)}
                  placeholder="Found at: N-Building / Cafeteria"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dateFound"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Date & Time Found
                </label>
                <input
                  id="dateFound"
                  type="datetime-local"
                  required
                  value={dateFound}
                  onChange={(event) => setDateFound(event.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="custodyStatus"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Custody Status
                </label>
                <select
                  id="custodyStatus"
                  value={custodyStatus}
                  onChange={(event) =>
                    setCustodyStatus(event.target.value as "held" | "released")
                  }
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  <option value="held">Held by staff</option>
                  <option value="released">Released to student</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="photoInput"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Photo (URL or keyword)
                </label>
                <input
                  id="photoInput"
                  type="text"
                  value={photoInput}
                  onChange={(event) => setPhotoInput(event.target.value)}
                  placeholder="e.g. 'backpack', 'iphone', or a direct image URL"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {message ? (
              <div
                className={`rounded-xl p-4 text-sm ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : message.type === "warning"
                      ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Logging..." : "Log Item"}
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
            * This is how the item will appear on the public board once logged.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-soft)] px-1">
          Claim Queue
        </h3>

        {actionMessage ? (
          <div
            className={`rounded-xl border p-4 text-sm ${
              actionMessage.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : actionMessage.type === "warning"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {actionMessage.text}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-soft)]">
            Loading latest claims...
          </div>
        ) : null}

        {claimQueue.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-soft)]">
            No claim requests yet. New claims will appear here for review.
          </div>
        ) : null}

        {claimQueue.map(([itemId, itemClaims]) => {
          const item = itemsById.get(itemId);
          if (!item) return null;
          const hasActiveClaim = itemClaims.some(
            (claim) => claim.status === "pending" || claim.status === "approved",
          );
          const displayStatus =
            item.status === "available" && hasActiveClaim ? "under_review" : item.status;
          const itemForCard =
            displayStatus === item.status ? item : { ...item, status: displayStatus };
          const approvedClaim = itemClaims.find((claim) => claim.status === "approved");

          return (
            <div
              key={itemId}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
                <div className="pointer-events-none">
                  <ItemCard item={itemForCard} />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]">
                        Item
                      </p>
                      <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {item.name}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--color-text-soft)]">
                      {displayStatus.replace("_", " ")}
                    </span>
                  </div>

                  {item.hiddenDescription && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        Staff Verification Secret
                      </p>
                      <p className="mt-1 text-xs text-blue-200/80">
                        {item.hiddenDescription}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {itemClaims.map((claim) => (
                      <div
                        key={claim.claimId}
                        className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_60%,transparent)] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]">
                              Claim {claim.claimId}
                            </p>
                            <p className="text-sm text-[var(--color-text-primary)]">
                              {claim.studentName} · {claim.studentId}
                            </p>
                          </div>
                          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--color-text-soft)]">
                            {claim.status}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-[var(--color-text-soft)]">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            Contact:
                          </span>{" "}
                          {claim.contactInfo}
                        </p>
                        <p className="mt-2 text-xs text-[var(--color-text-soft)]">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            Proof:
                          </span>{" "}
                          {claim.proofDescription}
                        </p>

                        {claim.status === "pending" ? (
                          <div className="mt-4 space-y-2">
                            <label
                              htmlFor={`notes-${claim.claimId}`}
                              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]"
                            >
                              Review Notes
                            </label>
                            <textarea
                              id={`notes-${claim.claimId}`}
                              rows={2}
                              value={reviewNotes[claim.claimId] ?? ""}
                              onChange={(event) =>
                                setReviewNotes((prev) => ({
                                  ...prev,
                                  [claim.claimId]: event.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                              placeholder="Add notes for approval or rejection"
                            />
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(claim.claimId)}
                                disabled={claimAction[claim.claimId] != null}
                                className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {claimAction[claim.claimId] === "approving"
                                  ? "Approving..."
                                  : "Approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(claim.claimId)}
                                disabled={claimAction[claim.claimId] != null}
                                className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {claimAction[claim.claimId] === "rejecting"
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-[var(--color-text-soft)]">
                            Reviewed by {claim.reviewedBy ?? "admin"}.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                    <p className="text-xs text-[var(--color-text-soft)]">
                      Release is enabled only after a claim is approved.
                    </p>
                    {approvedClaim ? (
                      <button
                        type="button"
                        onClick={() => handleRelease(item.id)}
                        disabled={
                          item.custodyStatus === "released" || releaseAction[item.id]
                        }
                        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {item.custodyStatus === "released"
                          ? "Item Released"
                          : releaseAction[item.id]
                            ? "Releasing..."
                            : "Release Item"}
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-text-soft)]">
                        Awaiting approval
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
