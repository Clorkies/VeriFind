"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/app/context/WalletProvider";

export function WalletConnect() {
  const {
    wallet,
    connectedWallet,
    availableWallets,
    selectedWallet,
    setSelectedWallet,
    isConnecting,
    error,
    connect,
    disconnect,
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = popoverRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setIsOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (!isOpen) return;
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const w = window as Window & {
      verifindWalletDebug?: {
        getStatus: () => {
          connected: boolean;
          selectedWallet: string;
          connectedWallet: string | null;
        };
        getNetworkId: () => Promise<number>;
        getChangeAddress: () => Promise<string>;
        getUsedAddresses: () => Promise<string[]>;
        getBalance: () => Promise<string>;
        getBalanceMesh: () => Promise<
          Awaited<ReturnType<NonNullable<typeof wallet>["getBalanceMesh"]>>
        >;
      };
    };

    w.verifindWalletDebug = {
      getStatus: () => ({
        connected: Boolean(wallet),
        selectedWallet,
        connectedWallet,
      }),
      getNetworkId: async () => {
        if (!wallet) throw new Error("Wallet not connected");
        return wallet.getNetworkId();
      },
      getChangeAddress: async () => {
        if (!wallet) throw new Error("Wallet not connected");
        return wallet.getChangeAddressBech32();
      },
      getUsedAddresses: async () => {
        if (!wallet) throw new Error("Wallet not connected");
        return wallet.getUsedAddressesBech32();
      },
      getBalance: async () => {
        if (!wallet) throw new Error("Wallet not connected");
        return wallet.getBalance();
      },
      getBalanceMesh: async () => {
        if (!wallet) throw new Error("Wallet not connected");
        return wallet.getBalanceMesh();
      },
    };

    return () => {
      delete w.verifindWalletDebug;
    };
  }, [wallet, selectedWallet, connectedWallet]);

  const badgeLabel = connectedWallet ?? "Guest";
  const badgeInitial = connectedWallet ? connectedWallet[0].toUpperCase() : "G";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div
        className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)] py-1 pl-1 pr-3 text-xs text-[var(--color-text-soft)] sm:flex"
        title={
          connectedWallet
            ? `${connectedWallet} connected`
            : "Guest — no wallet connected"
        }
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
          {badgeInitial}
        </span>
        <span>{badgeLabel}</span>
      </div>

      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          {connectedWallet ? "Wallet Connected" : "Connect Wallet"}
        </button>

        {isOpen ? (
          <div
            role="dialog"
            aria-label="Connect wallet"
            className="absolute right-0 mt-2 w-[min(92vw,320px)] rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-3 shadow-lg backdrop-blur"
          >
            <div className="space-y-2">
              {connectedWallet ? (
                <>
                  <p className="text-xs font-medium text-[var(--color-text-soft)]">
                    Connected:{" "}
                    <span className="text-[var(--color-text-primary)]">
                      {connectedWallet}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setIsOpen(false);
                    }}
                    className="btn-primary w-full rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    Disconnect
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <label className="block text-xs font-medium text-[var(--color-text-soft)]">
                    Select wallet
                  </label>
                  <select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
                  >
                    <option value="Disconnected">
                      {availableWallets.length === 0
                        ? "No wallets detected"
                        : "Select wallet"}
                    </option>
                    {availableWallets.map((walletName) => (
                      <option key={walletName} value={walletName}>
                        {walletName.charAt(0).toUpperCase() + walletName.slice(1)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={connect}
                    disabled={
                      isConnecting ||
                      selectedWallet === "Disconnected" ||
                      availableWallets.length === 0
                    }
                    className="btn-primary w-full rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                </>
              )}
            </div>

            {error ? (
              <p className="mt-2 text-xs text-red-300" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {!isOpen && error ? (
        <span className="hidden text-xs text-red-300 lg:block" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
