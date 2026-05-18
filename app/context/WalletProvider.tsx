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
      // Some wallets might fail to provide addresses if they are locked or in a specific state
      const change = await wallet.getChangeAddressBech32();
      let used: string[] = [];
      try {
        used = await wallet.getUsedAddressesBech32();
      } catch (e) {
        console.warn("Could not fetch used addresses, falling back to change address only:", e);
      }
      
      setChangeAddress(change);
      setWalletAddresses(Array.from(new Set([change, ...used])));
    } catch (e) {
      console.error("Failed to refresh wallet addresses:", e);
      // Only clear if we really can't get even the change address
      setChangeAddress(null);
      setWalletAddresses([]);
    }
  }, [wallet]);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const init = async () => {
      try {
        const installed = await MeshCardanoBrowserWallet.getInstalledWallets();
        let names = installed.map((w) => w.name.toLowerCase());
        
        // Safeguard: Manually check for common wallets if they are injected but not caught by Mesh
        if (typeof window !== "undefined" && (window as any).cardano) {
          const cardano = (window as any).cardano;
          const commonWallets = ["lace", "eternl", "nami", "flint", "yoroi", "typhoncip30", "vespr", "nufi"];
          commonWallets.forEach((w) => {
            if (cardano[w] && !names.includes(w)) {
              names.push(w);
            }
          });
        }

        if (names.length === 0 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(init, 500);
          return;
        }

        setAvailableWallets(names);

        const lastWallet =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEY)
            : null;
        
        if (!lastWallet) return;

        const normalizedLast = lastWallet.toLowerCase();

        // If we found the wallet in the list, try to restore it
        if (names.includes(normalizedLast)) {
          setSelectedWallet(normalizedLast);
          try {
            const restored = await MeshCardanoBrowserWallet.enable(normalizedLast);
            setWallet(restored);
            setConnectedWallet(normalizedLast);
          } catch (e) {
            console.error("Failed to restore wallet:", e);
          }
        } else if (retryCount >= maxRetries) {
          // Only remove if we've exhausted retries and it's definitely not there
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Wallet initialization error:", e);
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
