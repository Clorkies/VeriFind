"use client";

import { useEffect, useRef, useState } from "react";

export function HeroScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));

      setTilt({
        x: -clampedY * 18,
        y: clampedX * 18,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      <div
        ref={cardRef}
        className="surface-card lift relative overflow-hidden rounded-3xl p-6 transition-transform duration-200 ease-out sm:p-7"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
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
              New entry posted for a backpack found near the library. Audit
              trail anchored on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
