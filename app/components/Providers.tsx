"use client";

import { ItemsProvider } from "@/app/context/ItemsProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ItemsProvider>{children}</ItemsProvider>
  );
}
