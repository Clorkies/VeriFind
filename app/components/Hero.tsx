"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-[min(78vw,560px)] w-full max-w-[560px] items-center justify-center sm:h-[520px] lg:h-[560px]">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] blur-2xl" />
        <div className="relative h-32 w-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
      </div>
    ),
  },
);

export function Hero() {
  return (
    <section
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center gap-10 px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-12"
      aria-labelledby="hero-heading"
    >
      <div className="flex-1 space-y-7 lg:max-w-xl">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-3 py-1.5 text-xs font-medium tracking-wide text-[var(--color-text-soft)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span>
            Live on Cardano · Preview
          </span>
        </div>

        <h1
          id="hero-heading"
          className="animate-fade-up text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="text-3xl sm:text-4xl lg:text-5xl">
            Is your item VeriLost?{" "}
          </span>
          <span className="text-[var(--color-accent)]">VeriFind </span>it now!
        </h1>

        <p
          className="animate-fade-up text-lg leading-relaxed text-[var(--color-text-soft)] sm:text-xl"
          style={{ animationDelay: "0.15s" }}
        >
          A school-managed lost &amp; found registry for the CIT-U campus. Items are
          logged by staff, and students claim them with a Student ID and verified
          description—no wallets or QR stickers required.
        </p>

        <div
          className="animate-fade-up flex flex-wrap items-center gap-4 pt-2"
          style={{ animationDelay: "0.25s" }}
        >
          <Link
            href="/board"
            className="btn-primary inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-semibold transition hover:-translate-y-0.5 sm:text-lg"
          >
            VeriFind it Now
            <span aria-hidden>→</span>
          </Link>

          <Link
            href="/my-claims"
            className="btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-4 text-base font-medium transition hover:-translate-y-0.5"
          >
            My Claims
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#how-it-works"
            className="btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-4 text-base font-medium transition hover:-translate-y-0.5"
          >
            How it works
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Stats / trust strip */}
        <div
          className="animate-fade-up grid max-w-md grid-cols-3 gap-3 pt-6"
          style={{ animationDelay: "0.4s" }}
        >
          <Stat label="On-chain" value="Audit" />
          <Stat label="Claims" value="Staff" />
          <Stat label="Identity" value="Student ID" />
        </div>
      </div>

      <div className="flex flex-1 justify-center lg:justify-end">
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <HeroScene />
        </div>
      </div>

    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="panel-card lift rounded-xl p-3">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-soft)]">
          {label}
        </span>
      </div>
      <div className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
        {value}
      </div>
    </div>
  );
}
