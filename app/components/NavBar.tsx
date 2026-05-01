"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function ChainGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <path
        d="M10 16 L14 20 L22 12"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="6" fill="var(--color-accent)" opacity="0.15" />
    </svg>
  );
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition"
          aria-label="VeriFind home"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center">
            <ChainGlyph className="relative h-9 w-9 transition-transform duration-500 group-hover:rotate-[12deg]" />
          </span>
          <span className="text-lg font-semibold tracking-tight sm:text-xl">
            VeriFind
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/board">Browse</NavLink>
          <NavLink href="/#how-it-works">How it works</NavLink>
          <NavLink href="#">Docs</NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] py-1 pl-1 pr-3 text-xs text-[var(--color-text-soft)] sm:flex"
            title="Guest — no wallet connected"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
              G
            </span>
            <span>Guest</span>
          </div>
          <button
            type="button"
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-[var(--color-text-soft)] transition hover:text-[var(--color-text-primary)]"
    >
      {children}
    </Link>
  );
}
