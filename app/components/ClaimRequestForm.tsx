"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "@/app/context/ItemsProvider";

type ClaimRequestFormProps = {
  itemId: string;
  itemName: string;
};

export function ClaimRequestForm({ itemId, itemName }: ClaimRequestFormProps) {
  const { submitClaim } = useItems();
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [proofDescription, setProofDescription] = useState("");
  const [claimId, setClaimId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const reference = await submitClaim({
        itemId,
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        contactInfo: contactInfo.trim(),
        proofDescription: proofDescription.trim(),
      });
      setClaimId(reference);
    } catch (error) {
      console.error("Failed to submit claim:", error);
      setError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (claimId) {
    return (
      <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          ✓
        </div>
        <h3 className="text-lg font-bold text-emerald-300">Claim Submitted</h3>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Your claim for <span className="font-semibold">{itemName}</span> is now in the
          Staff Review queue.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-text-soft)]">
          Reference number
          <div className="mt-1 font-mono text-sm text-[var(--color-text-primary)]">
            {claimId}
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--color-text-soft)]">
          Keep this reference number for your records. Staff will verify your Student ID
          and description before approving.
        </p>
        {studentId.trim() ? (
          <Link
            href={`/my-claims?studentId=${encodeURIComponent(studentId.trim())}`}
            className="mt-5 inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Check claim status
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="studentId"
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          Student ID
        </label>
        <input
          id="studentId"
          type="text"
          required
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          placeholder="e.g. 21-2345-678"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="studentName"
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          Full Name
        </label>
        <input
          id="studentName"
          type="text"
          required
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          placeholder="e.g. Maria Dela Cruz"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contactInfo"
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          Email or Phone
        </label>
        <input
          id="contactInfo"
          type="text"
          required
          value={contactInfo}
          onChange={(event) => setContactInfo(event.target.value)}
          placeholder="e.g. student@cit.edu or 0917-000-0000"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="proofDescription"
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          Describe your item
        </label>
        <textarea
          id="proofDescription"
          required
          rows={4}
          value={proofDescription}
          onChange={(event) => setProofDescription(event.target.value)}
          placeholder="Include color, brand, markings, contents, or any unique detail."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        <p className="text-xs text-[var(--color-text-soft)]">
          Be specific—staff will compare your description to the physical item.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Claim Request"}
      </button>
      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error}
        </div>
      ) : null}
    </form>
  );
}
