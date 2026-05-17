import { Footer } from "../components/Footer";
import { GuestBanner } from "../components/GuestBanner";
import { NavBar } from "../components/NavBar";
import { OwnerQrCard } from "../components/OwnerQrCard";

export default function WalletPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Owner sticker
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Your VeriFind QR code
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-soft)]">
            Each wallet gets a unique QR code encoding your public address.
            Print it and attach it to items you want to protect—no signatures or
            vkeys required for finders.
          </p>
        </header>
        <div className="surface-card rounded-2xl p-6">
          <OwnerQrCard />
        </div>
      </main>
      <Footer />
      <GuestBanner />
    </div>
  );
}
