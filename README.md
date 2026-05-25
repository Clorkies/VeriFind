<div align="center">
  <img src="https://placehold.co/120x120/0f172a/e2e8f0?text=VF" alt="VeriFind logo" />
</div>

<h1 align="center">VeriFind</h1>
<p align="center"><strong>Is your item VeriLost? VeriFind it now!</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Cardano-0033ad?style=for-the-badge&logo=cardano&logoColor=white" alt="Cardano" />
  <img src="https://img.shields.io/badge/Blockchain-7c3aed?style=for-the-badge" alt="Blockchain" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Model-School--Managed%20Registry-2563eb?style=for-the-badge" alt="Model" />
  <img src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Bun-0f766e?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Status-Refactoring-f59e0b?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  A decentralized Lost &amp; Found registry for the CIT-U community. Students use their campus identity to report and claim items; school staff manage and verify all claims.
</p>

---

## Overview

VeriFind is a **school-managed Lost & Found registry** backed by a Cardano on-chain audit trail. No crypto wallet, no QR stickers, and no blockchain knowledge is required from students or finders.

The **Lost & Found office acts as the trusted authority**. Students identify themselves with their Student ID, and admin staff verify identity and ownership before releasing any item. Every action is recorded for auditability.

---

## How It Works

### For Finders
1. Bring the found item to the school's Lost & Found desk, or submit it through the public intake form on VeriFind.
2. Provide a description and location where the item was found.
3. An admin logs it into the registry and makes it visible on the public board.

### For Students (Claimants)
1. Browse the **Lost Items Board** and find your item.
2. Submit a **Claim Request** using your Student ID and a description of the item (color, brand, distinguishing marks, etc.).
3. Your claim enters a queue at the Lost & Found office.
4. Admin staff cross-check your description against the physical item and your ID against school records.
5. Once verified, the admin marks the claim as **Approved** and you may pick up the item in person, presenting your physical campus ID.

### For Admin (Lost & Found Staff)
1. Log items into the registry with photos, location, category, and status.
2. Review incoming claim requests from students.
3. Verify the claimant's Student ID and their provided description.
4. Approve or reject claims, and log the reason.
5. Release the physical item and mark status as **Returned**.

All admin actions are written to the audit log, and select registry milestones are anchored on-chain via Cardano transaction metadata.

---

## Why This Approach

The previous model required a Cardano wallet (e.g., Eternl, Lace, Nami) and QR stickers attached to personal items. This created two critical problems:

1. **Spoofable ownership** — anyone could attach their QR sticker to someone else's item and claim it.
2. **Narrow audience** — only students familiar with blockchain and Cardano wallets could participate.

The new model resolves both:

- **Ownership verification is human-in-the-loop**: admin staff physically verify the claimant's identity and their description of the item before release. A fraudulent claim cannot succeed without fooling a trained staff member.
- **No technical barrier**: any student with a campus ID can use VeriFind.

---

## Verification: How Ownership Is Confirmed

When a student submits a claim, they must provide:

1. **Their Student ID** — cross-checked against the school's student records by admin staff.
2. **A descriptive proof** — distinguishing details about the item (e.g., "black laptop, sticker on lid, cracked corner, name written inside case").

The admin then:
- Physically inspects the found item against the description.
- Confirms the Student ID against school records.
- Only approves the claim if both match with sufficient confidence.

The student must also **appear in person with their physical campus ID card** to collect the item.

This is the same model used by real-world institutional lost & found offices, and it is more fraud-resistant than QR stickers because the item cannot be claimed without a real person vouching for their identity.

---

## Actors & Responsibilities

| Actor | Role |
| --- | --- |
| **Finder** | Reports an item to the desk or via the public form. No account required. |
| **Student (Claimant)** | Browses the board, submits a claim request using their Student ID. |
| **Admin (L&F Staff)** | Logs items, reviews claims, verifies identity, releases items. |
| **VeriFind System** | Hosts the registry, manages status, records the audit trail, anchors data on-chain. |

---

## Item Lifecycle

```
Reported → Logged by Admin → Listed on Board → Claimed (Request) → Under Review → Approved/Rejected → Returned
```

---

## Blockchain's Role in the New Model

Cardano on-chain metadata is retained as an **immutable audit trail**, not as the ownership mechanism. Key events (item logged, claim approved, item returned) are anchored on-chain so the history is tamper-resistant and publicly verifiable.

Students and finders do not interact with the blockchain directly. The application backend handles on-chain writes through an admin-authenticated flow.

---

## Core Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Bun / Node | Package management and dev server |
| Framework | Next.js | App routes and UI |
| Styling | Tailwind CSS | Interface development |
| Blockchain SDK | MeshJS | Admin-side on-chain logging |
| Indexer / API | Blockfrost | Reading on-chain audit records |
| Auth | Student ID + Admin credentials | Identity without wallets |

---

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing page |
| `/board` | Public board of all logged found items |
| `/claim/[id]` | Submit a claim request for a specific item |
| `/my-claims` | View claim status (by Student ID lookup) |
| `/admin` | Admin dashboard: log items, review claims, release items |

---

## Getting Started

### Prerequisites

- Node.js 22+ (or Bun)
- Blockfrost API key (for on-chain audit logging)

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Environment Variables

Create `.env.local` at the repo root:

```bash
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
BLOCKFROST_PROJECT_ID=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CARDANO_ADMIN_MNEMONIC="word1 word2 ... word24"
CARDANO_NETWORK=preview
```

`CARDANO_ADMIN_MNEMONIC` is the school-controlled wallet used for admin-side on-chain audit anchoring. No student wallet is required.

---

## License

This project is for academic and development use unless stated otherwise by repository owners.