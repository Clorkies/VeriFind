import { parseOwnerQrPayload } from "./qrPayload";

export type OwnershipMatch = {
  matched: boolean;
  scannedAddress: string;
  walletAddresses: string[];
};

/** Compare a scanned sticker address against the connected wallet's addresses. */
export function verifyOwnership(
  scannedRaw: string,
  walletAddresses: string[],
): OwnershipMatch | null {
  const scannedAddress = parseOwnerQrPayload(scannedRaw);
  if (!scannedAddress) return null;

  const normalizedWallet = walletAddresses.map((a) => a.trim().toLowerCase());
  const normalizedScanned = scannedAddress.toLowerCase();

  return {
    matched: normalizedWallet.includes(normalizedScanned),
    scannedAddress,
    walletAddresses,
  };
}
