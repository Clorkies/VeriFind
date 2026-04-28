import Link from "next/link";

function CardanoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="16" cy="16" r="15" stroke="#3b82f6" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="6" fill="#3b82f6" opacity="0.35" />
      <circle cx="16" cy="16" r="2.5" fill="#60a5fa" />
      <circle cx="16" cy="8" r="1.5" fill="#93c5fd" />
      <circle cx="23" cy="20" r="1.5" fill="#93c5fd" />
      <circle cx="9" cy="20" r="1.5" fill="#93c5fd" />
    </svg>
  );
}

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-refraction/60 bg-void-900/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-text-primary transition hover:text-white sm:text-xl"
        >
          VeriFind
        </Link>
        <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <CardanoMark className="h-7 w-7 shrink-0" />
            <button
              type="button"
              className="rounded-lg bg-maroon px-3 py-2 text-sm font-medium text-white shadow-md transition hover:bg-maroon-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              Connect Wallet
            </button>
          </div>
          <div
            className="glass flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs text-text-subtle"
            title="Guest — no wallet connected"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-refraction/80 text-[10px] font-medium text-text-primary">
              G
            </span>
            <span className="hidden sm:inline">Guest</span>
          </div>
        </div>
      </div>
    </header>
  );
}
