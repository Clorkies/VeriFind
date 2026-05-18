import Link from "next/link";

const REPO_HREF = "https://github.com/Clorkies/VeriFind";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-14 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
              VeriFind
            </p>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-[1.35rem] lg:text-2xl">
              Built for a transparent campus lost-and-found ledger
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-soft)]">
              Track finds with on-chain metadata, print your owner QR sticker,
              and verify claims by scanning the tag. Source code on GitHub.
            </p>
          </div>

          <div className="flex justify-center md:justify-end md:pt-1">
            <a
              href={REPO_HREF}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="VeriFind on GitHub"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] text-[var(--color-text-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-accent)_32%,var(--color-border))] hover:text-[var(--color-accent)]"
            >
              <GitHubIcon className="h-[18px] w-[18px]" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col-reverse items-center justify-between gap-4 text-xs text-[var(--color-text-soft)] sm:flex-row sm:gap-6">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} VeriFind. Open source repository—see
              GitHub for license and contribution guidelines.
            </p>
            <p className="text-center sm:text-right">
              Crafted by{" "}
              <Link
                href={REPO_HREF}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--color-text-primary)] underline-offset-[3px] transition hover:text-[var(--color-accent)] hover:underline"
              >
                BBC
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.86 10.918c.574.105.783-.249.783-.555 0-.273-.01-.997-.016-1.957-3.197.695-3.872-1.54-3.872-1.54-.523-1.328-1.278-1.682-1.278-1.682-1.045-.715.079-.7.079-.7 1.156.081 1.764 1.187 1.764 1.187 1.027 1.76 2.695 1.252 3.352.958.104-.744.402-1.252.732-1.54-2.551-.29-5.234-1.275-5.234-5.675 0-1.253.448-2.279 1.183-3.082-.118-.29-.512-1.458.112-3.04 0 0 .965-.31 3.162 1.177a10.99 10.99 0 0 1 5.758 0c2.195-1.486 3.159-1.178 3.159-1.178.626 1.583.233 2.75.115 3.041.737.803 1.181 1.829 1.181 3.082 0 4.411-2.687 5.381-5.247 5.666.413.356.781 1.057.781 2.13 0 1.537-.014 2.777-.014 3.154 0 .309.206.666.79.553A11.503 11.503 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z" />
    </svg>
  );
}
