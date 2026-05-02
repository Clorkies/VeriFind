export type { Item, ItemCategory, ItemStatus } from "./itemTypes";
export { MOCK_ITEMS_DATA as MOCK_ITEMS } from "./mockItemsData";

export function truncateTxId(hash: string, start = 5, end = 5) {
  if (hash.length <= start + end + 2) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
