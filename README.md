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

<p align="center">
  <em>Logo is currently a placeholder and will be replaced in a future update.</em>
</p>

## Overview

VeriFind works like a decentralized bulletin board:
- A **Found report** is recorded as a blockchain transaction.
- A **Claim action** is recorded through a wallet signature.
- Status updates are tracked as follow-up on-chain references.

This creates a verifiable history of an item from discovery to return.

## Use Cases

- **Library Find:** A student finds keys in the study area and posts a report with immutable timestamp and location.
- **Verified Recovery:** A founder can inspect claimant wallet activity to reduce suspicious or repeated false claims.
- **Department Auditing:** Departments can monitor currently held items without manual spreadsheets.

## Key Features

1. **Wallet-Authenticated Reporting**  
   Users connect wallets (e.g., Eternl, Flint, MetaMask) instead of username/password, creating accountable and cryptographic identity trails.

2. **On-Chain Metadata Logging**  
   Item data (e.g., item type, color, location) is saved as transaction metadata, making records public, searchable, and tamper-resistant.

3. **Proof-of-Ownership Signature**  
   Claimers sign unique wallet messages, producing verifiable digital proof tied to the claim event.

4. **Searchable Ledger Indexing**  
   An off-chain indexer/API layer (e.g., Blockfrost) reads chain data and enables fast filters by location, category, and date.

5. **Multi-User Status Updates**  
   Item lifecycle states such as `Pending`, `Claimed`, or `Donated` are recorded via follow-up reference transactions.

## Core Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Bun | Fast package installs and dev runtime with native TypeScript support |
| Framework | Next.js | Server-side routes for secure API handling |
| Styling | Tailwind CSS | Rapid interface development |
| Blockchain SDK | MeshJS | Transaction building, metadata serialization, wallet integration |
| Indexer / API | Blockfrost | Blockchain reading and transaction history queries |

## Implementation Flow

### 1) Write Flow (Report Found Item)
- User fills report form in the frontend.
- MeshJS builds a transaction with item metadata.
- Transaction is signed in browser wallet.
- Signed transaction is broadcast to the network.

### 2) Read Flow (Browse Registry)
- Server-side route queries blockchain data through Blockfrost.
- Metadata is parsed and normalized.
- Frontend renders registry items for browsing and filtering.

## Why This Architecture

- **No smart contract required:** basic metadata transactions are enough for the MVP.
- **No traditional database required:** blockchain serves as the source of truth.
- **Single language stack:** TypeScript across frontend and backend.
- **Fast development loop:** Bun + Next.js enables quick iteration. ⚡

## Project Structure

```txt
app/
  page.tsx                 # Main dashboard / registry feed
  report/page.tsx          # Found item form and transaction builder
  api/items/route.ts       # Server-side fetch/parser for on-chain records
.env                       # Secrets (e.g., Blockfrost API key)
```

## Getting Started

### Prerequisites
- Bun installed
- Wallet extension configured
- Blockfrost API key (if using indexer endpoint)

### Install

```bash
bun install
```

### Run Development Server

```bash
bun dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` at the repo root and add the required keys:

```bash
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

- Get a project ID from [blockfrost.io](https://blockfrost.io). Pick the network you want to develop against (Preprod is recommended for testing).
- The project ID prefix (`preview` / `preprod` / `mainnet`) determines which network the SDK talks to. Your **connected wallet must be set to the same network**, otherwise transaction submission will fail.
- This variable is exposed to the browser (note the `NEXT_PUBLIC_` prefix) because the demo builds and submits transactions client-side. For production, proxy provider calls through a server route and keep the key private.
- Restart `bun dev` after editing `.env.local` so Next.js picks up the change.

To fund a Preprod wallet for the demo, request test ADA from the [Cardano testnet faucet](https://docs.cardano.org/cardano-testnet/tools/faucet).

### Try the simple-transaction demo

1. Set `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` as above and run `bun dev`.
2. Open `http://localhost:3000/board`.
3. Connect a Cardano browser wallet (Eternl, Lace, Nami, etc.) on the matching network.
4. Paste a recipient address and an amount in lovelace (e.g. `2000000` ≈ 2 ADA), then submit.
5. The panel shows the resulting transaction hash and a Cardanoscan link.

## License

This project is for academic and development use unless stated otherwise by repository owners.
