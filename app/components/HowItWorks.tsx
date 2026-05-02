"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Link2,
  Search,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Glows keyed to globals `--color-accent` (#8a63ff); verified step uses amber + emerald accents. */
const GLOW_STEP = "shadow-[0_0_42px_-6px_rgba(138,99,255,0.52)] bg-[rgba(138,99,255,0.26)]";

const GLOW_VERIFIED =
  "shadow-[0_0_46px_-4px_color-mix(in_srgb,var(--color-accent)_38%,rgba(234,179,8,0.42))] bg-[rgba(234,179,8,0.22)]";

const STEPS: {
  key: string;
  label: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  preview: ReactNode;
  iconGlow: string;
  labelClass: string;
  verified?: boolean;
}[] = [
  {
    key: "connect",
    label: "Step 1",
    title: "Connect",
    body: "Link your Cardano wallet. Your address is your unique campus identity—no passwords needed.",
    Icon: Wallet,
    preview: <PreviewConnect />,
    iconGlow: GLOW_STEP,
    labelClass: "text-[var(--color-accent)]",
  },
  {
    key: "report-search",
    label: "Step 2",
    title: "Report or Search",
    body: "Found an item? Log it on the ledger. Lost something? Browse the ‘Pinterest’ board of reported finds.",
    Icon: Search,
    preview: <PreviewBoard />,
    iconGlow: GLOW_STEP,
    labelClass: "text-[var(--color-accent)]",
  },
  {
    key: "prove",
    label: "Step 3",
    title: "Prove Ownership",
    body: "Found a match? Answer the finder's secret question. This proof is hashed and stored for verification.",
    Icon: Link2,
    preview: <PreviewProof />,
    iconGlow: GLOW_STEP,
    labelClass: "text-[var(--color-accent)]",
  },
  {
    key: "return",
    label: "Step 4",
    title: "Immutable Return",
    body: "Once verified, the transaction is settled. The ledger is updated, and your item is VeriFound.",
    Icon: Check,
    preview: <PreviewVerified />,
    iconGlow: GLOW_VERIFIED,
    labelClass: "text-[#eab308]",
    verified: true,
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-transparent py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mb-10 text-center md:mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
            From wallet to VeriFound in four steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-soft)] md:text-base">
            A simple path through the Cardano ledger—built so anyone on campus
            can follow along, no blockchain degree required.
          </p>
        </motion.header>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-4 lg:flex-row lg:items-stretch lg:justify-center">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-stretch"
            >
              <StepCard step={step} index={index} reduceMotion={!!reduceMotion} />
              {index < STEPS.length - 1 ? (
                <div
                  className="flex shrink-0 items-center justify-center text-[var(--color-text-soft)] lg:w-10"
                  aria-hidden
                >
                  <ArrowDown className="h-5 w-5 opacity-40 lg:hidden" />
                  <ArrowRight className="hidden h-5 w-5 opacity-40 lg:block" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  reduceMotion,
}: {
  step: (typeof STEPS)[number];
  index: number;
  reduceMotion: boolean;
}) {
  const { Icon, verified } = step;

  return (
    <motion.article
      className="surface-card relative flex w-full min-h-0 flex-1 cursor-default flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_78%,transparent)] p-5 shadow-[var(--color-card-shadow)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-out hover:border-[color-mix(in_srgb,var(--color-accent)_32%,var(--color-border))] hover:shadow-[0_20px_56px_rgba(7,5,17,0.48)] lg:max-w-none lg:min-w-[14rem]"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 22 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
      transition={{
        duration: 0.42,
        delay: index * 0.06,
        ease: [0.22, 0.8, 0.2, 1],
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -5, transition: { duration: 0.22, ease: [0.22, 0.8, 0.2, 1] } }
      }
    >
      <div className="mb-5 rounded-xl border border-white/[0.08] bg-[color-mix(in_srgb,var(--color-panel)_65%,transparent)] p-4 backdrop-blur-sm">
        {step.preview}
      </div>

      <div className="relative mb-4 flex items-start gap-3">
        <div className="relative shrink-0">
          <span
            className={`pointer-events-none absolute left-1/2 top-1/2 -z-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl ${step.iconGlow}`}
            aria-hidden
          />
          <span
            className={`relative grid h-12 w-12 place-items-center rounded-xl border backdrop-blur ${
              verified
                ? "border-[#eab308]/45 bg-[color-mix(in_srgb,#eab308_14%,var(--color-surface))] text-[#eab308]"
                : "border-[color-mix(in_srgb,var(--color-accent)_38%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent-soft)_75%,transparent)] text-[var(--color-accent)]"
            }`}
          >
            <Icon
              className="h-[22px] w-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]"
              strokeWidth={1.75}
            />
          </span>
        </div>
        {verified ? (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-[#eab308]/35 bg-[#eab308]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#eab308]">
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            Verified
          </span>
        ) : null}
      </div>

      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${step.labelClass}`}
      >
        {step.label}
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-[var(--color-text-primary)]">
        {step.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-soft)]">
        {step.body}
      </p>
    </motion.article>
  );
}

function PreviewConnect() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-2/5 rounded-md bg-[var(--color-text-primary)]/80" />
        <div className="h-2 w-14 rounded-full bg-[var(--color-accent)]/45" />
      </div>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent-soft)] ring-2 ring-[color-mix(in_srgb,var(--color-accent)_40%,transparent)]">
          <Wallet className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.5} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-2 w-full rounded bg-[var(--color-text-soft)]/20" />
          <div className="h-2 w-4/5 rounded bg-[var(--color-text-soft)]/15" />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2">
        <div className="h-6 w-6 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-panel))]" />
        <div className="h-2 flex-1 rounded bg-[var(--color-text-soft)]/22" />
      </div>
    </div>
  );
}

function PreviewBoard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[var(--color-text-soft)]" strokeWidth={1.75} />
        <div className="h-2 flex-1 rounded-full bg-[var(--color-text-soft)]/22" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[var(--color-accent)]/35 to-transparent ring-1 ring-[var(--color-border)]" />
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[var(--color-accent-soft)] to-transparent ring-1 ring-[var(--color-border)]" />
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[rgb(138_99_255)]/28 to-transparent ring-1 ring-[var(--color-border)]" />
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[var(--color-text-soft)]/12 to-transparent ring-1 ring-[var(--color-border)]" />
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[var(--color-accent-glow-strong)] to-transparent ring-1 ring-[var(--color-border)]" />
        <div className="aspect-square rounded-lg bg-gradient-to-br from-[rgb(159_139_245)]/22 to-transparent ring-1 ring-[var(--color-border)]" />
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--color-text-soft)]/12">
        <div className="h-2 w-1/2 rounded-full bg-[var(--color-accent)]/65" />
      </div>
    </div>
  );
}

function PreviewProof() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-[var(--color-bg)]/50 px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-soft)]">
          Secret prompt
        </p>
        <div className="mt-2 h-2 w-3/4 rounded bg-[var(--color-text-soft)]/18" />
      </div>
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" strokeWidth={1.75} />
        <div className="flex-1 font-mono text-[9px] leading-relaxed tracking-tight text-[var(--color-text-soft)]/80">
          SHA-256 proof · hashed on-chain placeholder
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-[linear-gradient(90deg,transparent,var(--color-accent)/40,transparent)] opacity-70"
          />
        ))}
      </div>
    </div>
  );
}

function PreviewVerified() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-1/3 rounded-md bg-[var(--color-text-primary)]/85" />
        <span className="flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
          <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
          Settled
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[color-mix(in_srgb,#eab308_12%,var(--color-panel))] p-3 ring-1 ring-[#eab308]/28">
          <div className="h-10 w-full rounded bg-[linear-gradient(180deg,var(--color-accent)_12%,transparent)]" />
        </div>
        <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 p-2">
          <div className="mx-auto mt-3 grid h-10 w-10 place-items-center rounded-full bg-emerald-500/25 text-emerald-300 shadow-[0_0_22px_-4px_rgba(52,211,153,0.45)]">
            <Check className="h-5 w-5" strokeWidth={2.25} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-2 flex-1 rounded bg-[var(--color-text-soft)]/15" />
        <div className="h-2 flex-1 rounded bg-[#eab308]/40" />
      </div>
    </div>
  );
}
