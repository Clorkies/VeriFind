/** VeriFind owner sticker payload: `verifind:v1:<bech32-address>` */
export const QR_SCHEME = "verifind";
export const QR_VERSION = "v1";

const PREFIX = `${QR_SCHEME}:${QR_VERSION}:`;

/** Encode a Cardano bech32 address for printing on item stickers. */
export function encodeOwnerQrPayload(address: string): string {
  return `${PREFIX}${address.trim()}`;
}

/** Parse a scanned QR string into an owner address, if valid. */
export function parseOwnerQrPayload(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith(PREFIX)) {
    const address = trimmed.slice(PREFIX.length);
    return isPlausibleCardanoAddress(address) ? address : null;
  }
  // Also accept bare bech32 addresses (e.g. from generic QR encoders)
  if (isPlausibleCardanoAddress(trimmed)) return trimmed;
  return null;
}

function isPlausibleCardanoAddress(value: string): boolean {
  return /^(addr1|addr_test1)[a-z0-9]+$/.test(value) && value.length >= 50;
}
