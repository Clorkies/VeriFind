export type ItemCategory = "electronics" | "books" | "valuables";

export type ItemStatus = "found" | "claimed" | "resolved";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  location: string;
  status: ItemStatus;
  imageUrl: string | null;
  txHash: string;
  foundAt: string;
  ownerAddress?: string;
}
