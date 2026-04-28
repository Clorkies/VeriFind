"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(72vw,520px)] w-full max-w-[520px] items-center justify-center rounded-3xl border border-refraction/60 bg-glass-700/30 sm:h-[480px] lg:h-[520px]">
        <div className="h-32 w-32 animate-pulse rounded-2xl border border-maroon/40 bg-refraction/20" />
      </div>
    ),
  },
);

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-28 pt-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-16">
      <div className="flex-1 space-y-6 lg:max-w-xl">
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Lost it? Found it. Ledger it.
        </h1>
        <p className="text-lg leading-relaxed sm:text-xl">
          <span className="text-text-primary">Is your item </span>
          <span className="text-text-primary">Veri</span>
          <span className="text-text-primary">Lost? </span>
          <span className="font-semibold text-maroon">VeriFind it now!</span>
        </p>
        <p className="max-w-lg text-base leading-relaxed text-text-subtle">
          The immutable, decentralized registry for the CIT-U campus. Security
          in transparency, no passwords.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/board"
            className="group maroon-glow inline-flex items-center gap-3 rounded-2xl border border-maroon/50 bg-maroon/25 px-8 py-4 text-lg font-semibold text-white shadow-xl transition hover:border-maroon hover:bg-maroon/40 hover:shadow-[0_0_48px_-10px_rgba(128,0,0,0.6)]"
          >
            VeriFind it Now
            <span
              className="inline-block transition group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
        <p className="text-xs uppercase tracking-widest text-text-subtle/80">
          On-chain metadata · Cardano · CIT-U
        </p>
      </div>
      <div className="flex flex-1 justify-center lg:justify-end">
        <HeroScene />
      </div>
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-text-subtle/50 sm:block">
        <span className="text-xs tracking-widest">↓</span>
      </div>
    </section>
  );
}
