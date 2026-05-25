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
          <NavLink href="/board">Board</NavLink>
          <NavLink href="/my-claims">My Claims</NavLink>
          <NavLink href="/#how-it-works">How it works</NavLink>
        </nav>
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
