"use client";

import { WalletProvider } from "@/app/context/WalletProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
