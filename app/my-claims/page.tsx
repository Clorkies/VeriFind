"use client";

import { useMemo, useState } from "react";
import { NavBar } from "@/app/components/NavBar";
import { Footer } from "@/app/components/Footer";
import { useItems } from "@/app/context/ItemsProvider";

const STATUS_STYLES = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  rejected: "border-rose-400/40 bg-rose-400/10 text-rose-300",
} as const;

export default function MyClaimsPage() {
  const { claims, items } = useItems();
  const [studentId, setStudentId] = useState("");

  const filtered = useMemo(() => {
    const target = studentId.trim().toLowerCase();
    if (!target) return [];
    return claims.filter((claim) => claim.studentId.toLowerCase() === target);
  }, [claims, studentId]);

  const itemsById = useMemo(() => {
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />

      <main className="mx-auto w-full flex-1 max-w-4xl px-4 py-10 pb-32 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-text-soft)]">
              Claim Status Lookup
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            My <span className="text-[var(--color-accent)]">Claims</span>
          </h1>
          <p className="max-w-2xl text-sm text-[var(--color-text-soft)] sm:text-base">
            Enter your Student ID to see the latest status of your claim requests.
          </p>
        </header>

        <div className="panel-card rounded-2xl p-6 sm:p-8">
          <label
            htmlFor="student-id"
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            Student ID
          </label>
          <input
            id="student-id"
            type="text"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="e.g. 2023-12345"
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>

        <section className="mt-8 space-y-4">
          {studentId.trim() && filtered.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-soft)]">
              No claims found for this Student ID yet.
            </div>
          ) : null}

          {filtered.map((claim) => {
            const item = itemsById.get(claim.itemId);
            return (
              <div
                key={claim.claimId}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]">
                      Claim Reference
                    </p>
                    <p className="font-mono text-sm text-[var(--color-text-primary)]">
                      {claim.claimId}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[claim.status]}`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-[var(--color-text-soft)]">
                  <p>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Item:
                    </span>{" "}
                    {item?.name ?? "Unknown item"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Submitted:
                    </span>{" "}
                    {new Date(claim.submittedAt).toLocaleString()}
                  </p>
                  {claim.reviewNotes ? (
                    <p>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Admin notes:
                      </span>{" "}
                      {claim.reviewNotes}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
