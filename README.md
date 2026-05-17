<div align="center">
  <img src="https://placehold.co/120x120/0f172a/e2e8f0?text=VF" alt="VeriFind logo placeholder" />
</div>

<h1 align="center">VeriFind</h1>
<p align="center"><strong>Is your item VeriLost? VeriFind it now!</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Cardano-0033ad?style=for-the-badge&logo=cardano&logoColor=white" alt="Cardano" />
  <img src="https://img.shields.io/badge/Blockchain-7c3aed?style=for-the-badge" alt="Blockchain" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Protocol-Proof--of--Lost-2563eb?style=for-the-badge" alt="Protocol" />
  <img src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Bun-0f766e?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Status-Early%20Development-f59e0b?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  A decentralized bulletin board for the CIT-U community to report and recover lost items with a transparent, tamper-resistant on-chain history.
</p>

## Overview

VeriFind works like a decentralized bulletin board:

- A **Found report** is recorded as a blockchain transaction.
- **Owners** print a personal QR sticker (`verifind:v1:<address>`) and attach it to their belongings.
- To **claim** an item, the owner scans the sticker in the app; if the address matches their connected wallet, ownership is verified—no signature or vkey required from the finder.

## Use Cases

- **Library Find:** A student finds keys in the study area and posts a report with immutable timestamp and location.
- **Sticker verification:** The owner scans their QR tag in VeriFind; a match with the connected wallet proves ownership instantly.
- **Department Auditing:** Departments can monitor currently held items without manual spreadsheets.

## Key Features

1. **Wallet-Authenticated Identity**  
   Users connect Cardano wallets (e.g., Eternl, Lace, Nami) instead of username/password.

2. **Owner QR Stickers**  
   Each wallet gets a downloadable QR code encoding its public address. Print and paste on laptops, IDs, and valuables.

3. **Scan-to-Verify Ownership**  
   Scan the sticker (camera or paste). The app compares the payload to the connected wallet—similar to Face ID for your address.

4. **On-Chain Metadata Logging**  
   Item data is saved as transaction metadata, making records public, searchable, and tamper-resistant.

5. **Searchable Ledger Indexing**  
   An off-chain indexer/API layer (e.g., Blockfrost) reads chain data and enables fast filters.

## Core Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Bun / Node | Package management and dev server |
| Framework | Next.js | App routes and UI |
| Styling | Tailwind CSS | Interface development |
| Blockchain SDK | MeshJS | Wallet integration |
| QR | `qrcode`, `@zxing/browser` | Sticker generation and camera scanning |
| Indexer / API | Blockfrost | Blockchain reading (planned) |

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing page |
| `/board` | Bulletin board of found items |
| `/wallet` | Generate and download your owner QR sticker |
| `/verify` | Scan or paste a sticker to verify ownership |

## Getting Started

### Prerequisites

- Node.js 22+ (or Bun)
- Cardano browser wallet extension
- Blockfrost API key (optional for future on-chain reads)

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` at the repo root:

```bash
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

- Get a project ID from [blockfrost.io](https://blockfrost.io).
- Your connected wallet must use the **same network** as the project ID prefix.
- For production, proxy Blockfrost through a server route and keep keys private.

## QR Payload Format

Owner stickers encode:

```txt
verifind:v1:<bech32-address>
```

Bare `addr1…` / `addr_test1…` strings are also accepted when scanned.

## License

This project is for academic and development use unless stated otherwise by repository owners.
