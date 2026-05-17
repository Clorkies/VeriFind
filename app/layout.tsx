import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { EutxoWatermark } from "./components/EutxoWatermark";
import { Providers } from "./components/Providers";
import { Analytics } from "@vercel/analytics/react";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeriFind — CIT-U Lost & Found on Cardano",
  description:
    "The immutable, decentralized registry for the CIT-U campus. On-chain metadata. No passwords.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={interTight.className}
    >
      <body>
        <EutxoWatermark />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
