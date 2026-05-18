"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Check, Loader2, ScanLine, X } from "lucide-react";
import { useWallet } from "@/app/context/WalletProvider";
import { QrScanner } from "./QrScanner";
import { verifyOwnership } from "@/lib/verifyOwnership";
import { Item } from "@/lib/itemTypes";
import { useItems } from "@/app/context/ItemsProvider";
import { useRouter } from "next/navigation";

type VerifyState =
  | { kind: "idle" }
  | { kind: "matched"; address: string }
  | { kind: "mismatch"; scanned: string }
  | { kind: "invalid" };

export function VerifyOwnershipPanel({ item }: { item: Item }) {
  const { connectedWallet, walletAddresses } = useWallet();
  const { updateItemStatus } = useItems();
  const router = useRouter();
  
  const [manualInput, setManualInput] = useState("");
  const [state, setState] = useState<VerifyState>({ kind: "idle" });
  const [scannerPaused, setScannerPaused] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const runVerify = useCallback(
    (raw: string) => {
      if (!connectedWallet || walletAddresses.length === 0) {
        setState({ kind: "idle" });
        return;
      }
      const result = verifyOwnership(raw, walletAddresses);
      if (!result) {
        setState({ kind: "invalid" });
        return;
      }

      // Check 1: Does the scanned QR match the user's wallet?
      if (!result.matched) {
        setState({ kind: "mismatch", scanned: result.scannedAddress });
        return;
      }

      // Check 2: Does the scanned QR match the item's registered owner?
      // (Case-insensitive comparison for robustness)
      const registeredOwner = item.ownerAddress?.trim().toLowerCase();
      const scannedAddress = result.scannedAddress.trim().toLowerCase();

      if (registeredOwner && registeredOwner !== scannedAddress) {
        // It's the user's own sticker, but NOT the one registered to this item
        setState({ kind: "mismatch", scanned: result.scannedAddress });
        return;
      }

      // If both checks pass, it's a match
      setState({ kind: "matched", address: result.scannedAddress });
      setScannerPaused(true);
    },
    [connectedWallet, walletAddresses, item.ownerAddress],
  );

  const handleScan = useCallback(
    (text: string) => {
      setManualInput(text);
      runVerify(text);
    },
    [runVerify],
  );

  const handleFinalClaim = async () => {
    setIsClaiming(true);
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateItemStatus(item.id, "claimed");
    setIsClaiming(false);
    router.push("/board");
  };

  const reset = () => {
    setState({ kind: "idle" });
    setManualInput("");
    setScannerPaused(false);
  };

  if (item.status === "claimed") {
    return (
      <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-emerald-300">Item Successfully Claimed</h3>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          The ledger has been updated. This item is now marked as claimed on-chain.
        </p>
        <Link
          href="/board"
          className="btn-primary mt-6 inline-flex rounded-lg px-6 py-2.5 text-sm font-semibold"
        >
          Return to Bulletin Board
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!connectedWallet ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_70%,transparent)] p-4 text-sm text-[var(--color-text-soft)]">
          Connect your wallet in the nav bar first. Verification compares the
          sticker&apos;s address to your connected wallet—like Face ID for your
          public key.
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <ScanLine className="h-5 w-5 text-[var(--color-accent)]" />
          Scan owner sticker
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Point your camera at the QR code printed on the item. If the sticker 
          matches your wallet, the option to claim on-chain will appear.
        </p>
        <QrScanner onScan={handleScan} paused={scannerPaused} />
      </section>

      <section className="space-y-3">
        <label
          htmlFor="manual-qr"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]"
        >
          Or paste sticker payload
        </label>
        <textarea
          id="manual-qr"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="verifind:v1:addr_test1..."
          rows={3}
          spellCheck={false}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => runVerify(manualInput)}
            disabled={!connectedWallet || !manualInput.trim()}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            Verify ownership
          </button>
          {state.kind !== "idle" ? (
            <button
              type="button"
              onClick={reset}
              className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Scan again
            </button>
          ) : null}
        </div>
      </section>

      {state.kind === "matched" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <Check className="h-5 w-5" />
            Owner verified
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            This sticker belongs to your connected wallet. You can now finalize 
            the claim to update the decentralized ledger.
          </p>
          
          <button
            type="button"
            onClick={handleFinalClaim}
            disabled={isClaiming}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold shadow-lg shadow-emerald-500/10"
          >
            {isClaiming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating Ledger...
              </>
            ) : (
              "Confirm Claim on Ledger"
            )}
          </button>
        </div>
      ) : null}

      {state.kind === "mismatch" ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4"
        >
          <div className="flex items-center gap-2 font-semibold text-amber-200">
            <X className="h-5 w-5" />
            Address does not match
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            The scanned sticker belongs to a different wallet than the one you
            have connected.
          </p>
          <p className="mt-2 break-all font-mono text-xs text-[var(--color-text-primary)]">
            {state.scanned}
          </p>
        </div>
      ) : null}

      {state.kind === "invalid" ? (
        <p className="text-sm text-red-300" role="alert">
          Could not read a VeriFind owner address from that code. Make sure you
          are scanning a VeriFind sticker or a valid Cardano address.
        </p>
      ) : null}
    </div>
  );
}
