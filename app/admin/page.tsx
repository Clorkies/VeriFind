import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { AdminItemForm } from "../components/AdminItemForm";

export default function AdminPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      
      <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-10 pb-32 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_86%,transparent)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-text-soft)]">
              Admin Portal
            </span>
          </div>
          <h1
            className="animate-fade-up text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            style={{ animationDelay: "0.05s" }}
          >
            Manage <span className="text-[var(--color-accent)]">Ledger</span>
          </h1>
          <p
            className="animate-fade-up max-w-2xl text-sm text-[var(--color-text-soft)] sm:text-base"
            style={{ animationDelay: "0.15s" }}
          >
            Authorized personnel only. Log items, review claims, and release verified
            items to students. On-chain logging is triggered from approved actions.
          </p>
        </header>

        <AdminItemForm />
      </main>

      <Footer />
    </div>
  );
}
