"use client";

import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useEffect, useMemo, useState } from "react";
import { sendLovelace } from "@/lib/transactions";

const STORAGE_KEY = "verifind.connectedWallet";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; txHash: string; networkId: number }
  | { kind: "error"; message: string };

type WalletInfo = {
  changeAddress: string;
  networkId: number;
};

function inferExpectedNetworkId(projectId: string | undefined): number | null {
  if (!projectId) return null;
  if (projectId.startsWith("mainnet")) return 1;
  if (projectId.startsWith("preprod") || projectId.startsWith("preview"))
    return 0;
  return null;
}

function networkLabel(networkId: number): string {
  return networkId === 1 ? "Mainnet" : "Testnet";
}

function cardanoscanUrl(txHash: string, networkId: number): string {
  if (networkId === 1) return `https://cardanoscan.io/transaction/${txHash}`;
  return `https://preprod.cardanoscan.io/transaction/${txHash}`;
}

function shorten(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes("blockfrost api key")) {
    return "Blockfrost API key is missing. Add NEXT_PUBLIC_BLOCKFROST_PROJECT_ID to your environment and restart the dev server.";
  }
  if (lower.includes("user declined") || lower.includes("user rejected") || lower.includes("declined")) {
    return "Signing was declined in the wallet.";
  }
  if (lower.includes("insufficient") || lower.includes("not enough")) {
    return "Insufficient funds in the connected wallet.";
  }
  if (lower.includes("network")) {
    return raw;
  }
  return raw || "Something went wrong.";
}

export function SendLovelacePanel() {
  const expectedNetworkId = useMemo(
    () => inferExpectedNetworkId(process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID),
    [],
  );

  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("Disconnected");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const installed = await MeshCardanoBrowserWallet.getInstalledWallets();
        if (cancelled) return;

        const names = installed.map((w) => w.name);
        setAvailableWallets(names);

        const lastWallet =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEY)
            : null;
        if (!lastWallet || !names.includes(lastWallet)) {
          if (lastWallet && !names.includes(lastWallet)) {
            localStorage.removeItem(STORAGE_KEY);
          }
          return;
        }

        setSelectedWallet(lastWallet);
        try {
          const restored = await MeshCardanoBrowserWallet.enable(lastWallet);
          if (cancelled) return;
          setWallet(restored);
          setConnectedWallet(lastWallet);
          await loadWalletInfo(restored);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        if (!cancelled) {
          setWalletError("Unable to detect browser wallets.");
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadWalletInfo = async (w: MeshCardanoBrowserWallet) => {
    try {
      const [changeAddress, networkId] = await Promise.all([
        w.getChangeAddressBech32(),
        w.getNetworkId(),
      ]);
      setWalletInfo({ changeAddress, networkId });
    } catch {
      setWalletInfo(null);
    }
  };

  const handleConnect = async () => {
    if (selectedWallet === "Disconnected") return;
    setIsConnecting(true);
    setWalletError(null);
    try {
      const connected = await MeshCardanoBrowserWallet.enable(selectedWallet);
      setWallet(connected);
      setConnectedWallet(selectedWallet);
      localStorage.setItem(STORAGE_KEY, selectedWallet);
      await loadWalletInfo(connected);
    } catch {
      setWalletError(
        "Wallet connection failed. Please approve the wallet prompt and try again.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setWalletInfo(null);
    setConnectedWallet(null);
    setSelectedWallet("Disconnected");
    localStorage.removeItem(STORAGE_KEY);
    setWalletError(null);
  };

  const trimmedAddress = recipient.trim();
  const trimmedAmount = amount.trim();
  const amountIsValid =
    /^\d+$/.test(trimmedAmount) && trimmedAmount.length > 0 && BigInt(trimmedAmount) > BigInt(0);
  const addressIsValid = trimmedAddress.length > 0;
  const formIsValid = amountIsValid && addressIsValid;
  const isSubmitting = status.kind === "submitting";
  const canSubmit = Boolean(wallet) && formIsValid && !isSubmitting;

  const adaPreview = useMemo(() => {
    if (!amountIsValid) return null;
    try {
      const lovelace = BigInt(trimmedAmount);
      const million = BigInt(1_000_000);
      const whole = lovelace / million;
      const frac = lovelace % million;
      const fracStr = frac.toString().padStart(6, "0").replace(/0+$/, "");
      return fracStr.length > 0 ? `${whole}.${fracStr} ADA` : `${whole} ADA`;
    } catch {
      return null;
    }
  }, [amountIsValid, trimmedAmount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet) {
      setStatus({ kind: "error", message: "Connect a wallet first." });
      return;
    }
    if (!formIsValid) return;

    if (
      walletInfo &&
      expectedNetworkId !== null &&
      walletInfo.networkId !== expectedNetworkId
    ) {
      setStatus({
        kind: "error",
        message: `Network mismatch — Blockfrost project is ${networkLabel(expectedNetworkId)} but the wallet is on ${networkLabel(walletInfo.networkId)}. Switch your wallet network and reconnect.`,
      });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const txHash = await sendLovelace(wallet, {
        address: trimmedAddress,
        amount: trimmedAmount,
      });
      const networkId = walletInfo?.networkId ?? (await wallet.getNetworkId());
      setStatus({ kind: "success", txHash, networkId });
    } catch (err) {
      setStatus({ kind: "error", message: describeError(err) });
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
      aria-label="Send Lovelace demo"
    >
      <div className="surface-card animate-fade-up rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-1 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_80%,transparent)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Demo · Simple Transaction
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Send <span className="text-[var(--color-accent)]">Lovelace</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">
              Build, sign and submit a Cardano transaction using Blockfrost +
              Mesh SDK directly from the browser.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            {connectedWallet ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] px-3 py-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[var(--color-text-soft)]">
                    Connected
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {connectedWallet}
                  </span>
                  {walletInfo ? (
                    <span className="text-[var(--color-text-soft)]">
                      · {networkLabel(walletInfo.networkId)}
                    </span>
                  ) : null}
                </span>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="btn-ghost rounded-lg px-3 py-1 text-xs font-semibold"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
                  aria-label="Select wallet"
                >
                  <option value="Disconnected">
                    {availableWallets.length === 0
                      ? "No wallets detected"
                      : "Select wallet"}
                  </option>
                  {availableWallets.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={
                    isConnecting ||
                    selectedWallet === "Disconnected" ||
                    availableWallets.length === 0
                  }
                  className="btn-primary rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConnecting ? "Connecting…" : "Connect"}
                </button>
              </div>
            )}
          </div>
        </div>

        {walletError ? (
          <p className="mt-3 text-xs text-red-300" role="alert">
            {walletError}
          </p>
        ) : null}

        {walletInfo ? (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_70%,transparent)] p-3 text-xs text-[var(--color-text-soft)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[var(--color-text-soft)]">Your address: </span>
              <span className="font-mono text-[var(--color-text-primary)]">
                {shorten(walletInfo.changeAddress, 14, 10)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copy(walletInfo.changeAddress)}
              className="self-start rounded-md border border-[var(--color-border)] px-2 py-1 text-[11px] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] sm:self-auto"
            >
              Copy
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <label
              htmlFor="recipient"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]"
            >
              Recipient address
            </label>
            <input
              id="recipient"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="addr_test1..."
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
            {recipient && !addressIsValid ? (
              <p className="mt-1 text-xs text-red-300">
                Address cannot be empty.
              </p>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="amount"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]"
            >
              Amount (lovelace)
            </label>
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2000000"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
            <p className="mt-1 text-xs text-[var(--color-text-soft)]">
              {adaPreview
                ? `≈ ${adaPreview}`
                : "1 ADA = 1,000,000 lovelace"}
            </p>
            {amount && !amountIsValid ? (
              <p className="mt-1 text-xs text-red-300">
                Amount must be a positive integer.
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-text-soft)]">
              {expectedNetworkId === null
                ? "Network: inferred from your Blockfrost project ID."
                : `Network: ${networkLabel(expectedNetworkId)} (from Blockfrost project ID).`}
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary lift rounded-lg px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting…"
                : wallet
                  ? "Send Transaction"
                  : "Connect a wallet"}
            </button>
          </div>
        </form>

        {status.kind === "success" ? (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm"
          >
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-[12px]">
                ✓
              </span>
              Transaction submitted
            </div>
            <div className="mt-2 break-all font-mono text-xs text-[var(--color-text-primary)]">
              {status.txHash}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copy(status.txHash)}
                className="btn-ghost rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                Copy hash
              </button>
              <a
                href={cardanoscanUrl(status.txHash, status.networkId)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost rounded-md px-3 py-1.5 text-xs font-semibold"
              >
                View on Cardanoscan ↗
              </a>
            </div>
          </div>
        ) : null}

        {status.kind === "error" ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200"
          >
            <div className="font-semibold text-red-200">
              Transaction failed
            </div>
            <p className="mt-1 text-red-200/90">{status.message}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
