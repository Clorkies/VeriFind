"use client";

import { WalletProvider } from "@/app/context/WalletProvider";
import { ItemsProvider } from "@/app/context/ItemsProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ItemsProvider>
      <WalletProvider>{children}</WalletProvider>
    </ItemsProvider>
  );
}
