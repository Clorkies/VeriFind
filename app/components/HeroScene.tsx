"use client";

export function HeroScene() {
  return (
    <div className="relative w-full max-w-[540px]">
      <div
        className="absolute -left-6 -top-8 h-36 w-36 rounded-full blur-[85px]"
        style={{ background: "var(--color-accent-glow-strong)" }}
      />
      <div
        className="absolute -bottom-8 right-0 h-32 w-32 rounded-full blur-[75px]"
        style={{ background: "var(--color-accent-glow)" }}
      />
      <div className="surface-card lift relative overflow-hidden rounded-3xl p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              VeriFind Overview
            </p>
            <p className="mt-2 text-xl font-semibold">Lost & Found Activity</p>
          </div>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            Live
          </span>
        </div>

        <div className="grid gap-3">
          <div className="panel-card rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Resolved Cases</p>
              <p className="text-sm font-semibold text-[var(--color-accent)]">67%</p>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-border)]">
              <div className="h-2 w-[67%] rounded-full bg-[var(--color-accent)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="panel-card rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                Posts Today
              </p>
              <p className="mt-2 text-2xl font-bold">24</p>
            </div>
            <div className="panel-card rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                Claims
              </p>
              <p className="mt-2 text-2xl font-bold">18</p>
            </div>
          </div>

          <div className="panel-card rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              Latest
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-soft)]">
              New entry posted for a missing wallet near the library. On-chain
              receipt minted in 2.3s.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
