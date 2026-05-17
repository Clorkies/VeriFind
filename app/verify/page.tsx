import { Footer } from "../components/Footer";
import { GuestBanner } from "../components/GuestBanner";
import { NavBar } from "../components/NavBar";
import { VerifyOwnershipPanel } from "../components/VerifyOwnershipPanel";

export default function VerifyPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Ownership check
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Scan to verify
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-soft)]">
            Scan the QR sticker on a found item. If it matches your connected
            wallet, you have proven ownership—similar to Face ID, but tied to
            your Cardano address.
          </p>
        </header>
        <div className="surface-card rounded-2xl p-6">
          <VerifyOwnershipPanel />
        </div>
      </main>
      <Footer />
      <GuestBanner />
    </div>
  );
}
