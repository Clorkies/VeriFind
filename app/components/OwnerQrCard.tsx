"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { encodeOwnerQrPayload } from "@/lib/qrPayload";
import { useWallet } from "@/app/context/WalletProvider";

function shorten(value: string, head = 12, tail = 8): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function OwnerQrCard() {
  const { changeAddress, connectedWallet } = useWallet();
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!changeAddress) {
      setDataUrl(null);
      return;
    }
    let cancelled = false;
    const payload = encodeOwnerQrPayload(changeAddress);
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: { dark: "#0f0a1a", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [changeAddress]);

  if (!connectedWallet || !changeAddress) {
    return (
      <p className="text-sm text-[var(--color-text-soft)]">
        Connect a wallet to generate your owner sticker QR code.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-card-shadow)]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="Your VeriFind owner QR code"
            width={280}
            height={280}
            className="block"
          />
        ) : (
          <div className="grid h-[280px] w-[280px] place-items-center text-sm text-[var(--color-text-soft)]">
            Generating QR…
          </div>
        )}
      </div>

      <div className="w-full space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-soft)]">
          Sticker encodes
        </p>
        <p className="break-all font-mono text-xs text-[var(--color-text-primary)]">
          {shorten(changeAddress, 18, 12)}
        </p>
        <p className="text-xs leading-relaxed text-[var(--color-text-soft)]">
          Print this code and attach it to your belongings. When someone finds
          your item, they scan the sticker in VeriFind to confirm you are the
          owner—like Face ID, but for your wallet address.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(changeAddress)}
          className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Copy address
        </button>
        {dataUrl ? (
          <a
            href={dataUrl}
            download="verifind-owner-qr.png"
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Download PNG
          </a>
        ) : null}
      </div>
    </div>
  );
}
