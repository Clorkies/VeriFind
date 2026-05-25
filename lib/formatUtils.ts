export function truncateTxId(hash?: string, start = 5, end = 5) {
  if (!hash) return "pending";
  if (hash.length <= start + end + 2) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
