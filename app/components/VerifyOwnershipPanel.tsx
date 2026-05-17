"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Check, ScanLine, X } from "lucide-react";
import { useWallet } from "@/app/context/WalletProvider";
import { QrScanner } from "./QrScanner";
import { verifyOwnership } from "@/lib/verifyOwnership";

type VerifyState =
  | { kind: "idle" }
  | { kind: "matched"; address: string }
  | { kind: "mismatch"; scanned: string }
  | { kind: "invalid" };

export function VerifyOwnershipPanel() {
  const { connectedWallet, walletAddresses } = useWallet();
  const [manualInput, setManualInput] = useState("");
  const [state, setState] = useState<VerifyState>({ kind: "idle" });
  const [scannerPaused, setScannerPaused] = useState(false);

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
      if (result.matched) {
        setState({ kind: "matched", address: result.scannedAddress });
        setScannerPaused(true);
      } else {
        setState({ kind: "mismatch", scanned: result.scannedAddress });
      }
    },
    [connectedWallet, walletAddresses],
  );

  const handleScan = useCallback(
    (text: string) => {
      setManualInput(text);
      runVerify(text);
    },
    [runVerify],
  );

  const reset = () => {
    setState({ kind: "idle" });
    setManualInput("");
    setScannerPaused(false);
  };

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
          Point your camera at the QR code printed on the item. The finder does
          not need to know your signature or vkey—only that the sticker matches
          your wallet when you claim it.
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
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4"
        >
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <Check className="h-5 w-5" />
            Owner verified
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            This sticker belongs to your connected wallet. You can proceed with
            a claim on the bulletin board.
          </p>
          <p className="mt-2 break-all font-mono text-xs text-[var(--color-text-primary)]">
            {state.address}
          </p>
          <Link
            href="/board"
            className="btn-primary mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Go to bulletin board
          </Link>
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
