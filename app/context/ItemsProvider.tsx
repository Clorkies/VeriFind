"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Item } from "@/lib/itemTypes";
import { MOCK_ITEMS } from "@/lib/mockItems";

type ItemsContextType = {
  items: Item[];
  addItem: (item: Item) => void;
  updateItemStatus: (id: string, status: ItemStatus) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);

  const addItem = (item: Item) => {
    setItems((prev) => [item, ...prev]);
  };

  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItemStatus }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
}
