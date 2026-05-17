"use client";

import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "verifind.connectedWallet";

type WalletContextValue = {
  wallet: MeshCardanoBrowserWallet | null;
  connectedWallet: string | null;
  changeAddress: string | null;
  walletAddresses: string[];
  availableWallets: string[];
  selectedWallet: string;
  setSelectedWallet: (name: string) => void;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshAddresses: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("Disconnected");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [changeAddress, setChangeAddress] = useState<string | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAddresses = useCallback(async () => {
    if (!wallet) {
      setChangeAddress(null);
      setWalletAddresses([]);
      return;
    }
    try {
      const [change, used] = await Promise.all([
        wallet.getChangeAddressBech32(),
        wallet.getUsedAddressesBech32(),
      ]);
      setChangeAddress(change);
      setWalletAddresses(Array.from(new Set([change, ...used])));
    } catch {
      setChangeAddress(null);
      setWalletAddresses([]);
    }
  }, [wallet]);

  useEffect(() => {
    const init = async () => {
      try {
        const installed = await MeshCardanoBrowserWallet.getInstalledWallets();
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
        const restored = await MeshCardanoBrowserWallet.enable(lastWallet);
        setWallet(restored);
        setConnectedWallet(lastWallet);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    init();
  }, []);

  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const connect = useCallback(async () => {
    if (selectedWallet === "Disconnected") return;
    setIsConnecting(true);
    setError(null);
    try {
      const connected = await MeshCardanoBrowserWallet.enable(selectedWallet);
      setWallet(connected);
      setConnectedWallet(selectedWallet);
      localStorage.setItem(STORAGE_KEY, selectedWallet);
    } catch {
      setError("Wallet connection failed. Please approve the wallet prompt.");
    } finally {
      setIsConnecting(false);
    }
  }, [selectedWallet]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setConnectedWallet(null);
    setSelectedWallet("Disconnected");
    setChangeAddress(null);
    setWalletAddresses([]);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      wallet,
      connectedWallet,
      changeAddress,
      walletAddresses,
      availableWallets,
      selectedWallet,
      setSelectedWallet,
      isConnecting,
      error,
      connect,
      disconnect,
      refreshAddresses,
    }),
    [
      wallet,
      connectedWallet,
      changeAddress,
      walletAddresses,
      availableWallets,
      selectedWallet,
      isConnecting,
      error,
      connect,
      disconnect,
      refreshAddresses,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
