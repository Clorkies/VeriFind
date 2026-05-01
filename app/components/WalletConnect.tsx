"use client";

import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useEffect, useState } from "react";

export function WalletConnect() {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("Disconnected");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInstalledWallets = async () => {
      try {
        const wallets = await MeshCardanoBrowserWallet.getInstalledWallets();
        setAvailableWallets(wallets.map((wallet) => wallet.name));
      } catch {
        setError("Unable to detect browser wallets.");
      }
    };

    getInstalledWallets();
  }, []);

  const connectWallet = async () => {
    if (selectedWallet === "Disconnected") return;

    setIsConnecting(true);
    setError(null);
    try {
      await MeshCardanoBrowserWallet.enable(selectedWallet);
      setConnectedWallet(selectedWallet);
    } catch {
      setError("Wallet connection failed. Please approve the wallet prompt.");
    } finally {
      setIsConnecting(false);
    }
  };

  const badgeLabel = connectedWallet ?? "Guest";
  const badgeInitial = connectedWallet ? connectedWallet[0].toUpperCase() : "G";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div
        className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] py-1 pl-1 pr-3 text-xs text-[var(--color-text-soft)] sm:flex"
        title={connectedWallet ? `${connectedWallet} connected` : "Guest — no wallet connected"}
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
          {badgeInitial}
        </span>
        <span>{badgeLabel}</span>
      </div>

      <select
        value={selectedWallet}
        onChange={(e) => setSelectedWallet(e.target.value)}
        className="hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] md:block"
        aria-label="Select wallet"
      >
        <option value="Disconnected">Select wallet</option>
        {availableWallets.map((walletName) => (
          <option key={walletName} value={walletName}>
            {walletName}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={connectWallet}
        disabled={
          isConnecting ||
          selectedWallet === "Disconnected" ||
          availableWallets.length === 0 ||
          Boolean(connectedWallet)
        }
        className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {connectedWallet ? "Wallet Connected" : isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error ? (
        <span className="hidden text-xs text-red-300 lg:block" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
