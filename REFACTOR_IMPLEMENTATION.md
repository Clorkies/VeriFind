# VeriFind — Technical Refactor & Implementation Guide

> Migrating from Wallet + QR ownership model → School-Managed Registry with Student ID verification

---

## 1. Summary of Architectural Change

| Concern | Old Approach | New Approach |
|---|---|---|
| Identity | Cardano wallet address | Student ID |
| Ownership proof | QR sticker + wallet match | Staff-verified description + physical ID |
| Claim submission | Student scans QR, signs on-chain | Student submits form request; admin approves |
| On-chain role | Ownership record | Audit trail only |
| Who can use it | Students with Cardano wallets | Any student with a campus ID |

The blockchain is kept but its role is **narrowed**: it no longer represents ownership, only an immutable log of key events.

---

## 2. Files to Delete

These files implement the wallet/QR flow and have no place in the new model. Remove them entirely.

```
app/context/WalletProvider.tsx
app/components/WalletConnect.tsx
app/components/OwnerQrCard.tsx
app/components/QrScanner.tsx
app/wallet/page.tsx
lib/qrPayload.ts
lib/verifyOwnership.ts
```

Also remove these npm dependencies:

```bash
npm uninstall @meshsdk/react @meshsdk/core qrcode @zxing/browser
# MeshJS may be re-added later for admin-side on-chain logging only
```

---

## 3. Data Model Refactor

### 3.1 `lib/itemTypes.ts`

**Remove:**
```ts
ownerAddress: string;
txHash: string;
```

**Add:**
```ts
// Item
export type ItemStatus =
  | 'available'       // logged, no claim yet
  | 'under_review'    // claim submitted, pending admin
  | 'returned'        // released to verified owner
  | 'unclaimed';      // held past retention period

export interface FoundItem {
  id: string;
  name: string;
  description: string;
  category: string;
  locationFound: string;
  dateFound: string;            // ISO date
  photoUrl?: string;
  status: ItemStatus;
  custodyStatus: 'held' | 'released';
  loggedBy: string;             // adminId
  loggedAt: string;             // ISO datetime
  auditLog: AuditEntry[];
  txHash?: string;              // on-chain anchor (optional)
}

// Claim Request
export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface ClaimRequest {
  claimId: string;
  itemId: string;
  studentId: string;            // CIT-U student ID
  studentName: string;
  contactInfo: string;          // email or phone
  proofDescription: string;     // distinguishing details provided by claimant
  status: ClaimStatus;
  submittedAt: string;
  reviewedBy?: string;          // adminId
  reviewedAt?: string;
  reviewNotes?: string;         // reason for approval/rejection
}

// Audit Entry
export interface AuditEntry {
  timestamp: string;
  action: 'logged' | 'claimed' | 'approved' | 'rejected' | 'released';
  actor: string;                // adminId or studentId
  notes?: string;
}

// Admin
export interface AdminUser {
  adminId: string;
  name: string;
  role: 'staff' | 'supervisor';
}
```

### 3.2 `lib/mockItemsData.ts`

Replace all entries that use `ownerAddress` / `txHash` with the new `FoundItem` shape. Remove any reference to wallet addresses. Use `studentId` fields only where a claimant is attached.

---

## 4. Context Refactor

### 4.1 Delete: `app/context/WalletProvider.tsx`

Remove it and all imports throughout the codebase.

### 4.2 Update: `app/context/ItemsProvider.tsx`

Remove wallet-aware logic. The context should expose:

```ts
interface ItemsContextValue {
  items: FoundItem[];
  claims: ClaimRequest[];
  submitClaim: (claim: Omit<ClaimRequest, 'claimId' | 'submittedAt' | 'status'>) => void;
  approveClaim: (claimId: string, adminId: string, notes?: string) => void;
  rejectClaim: (claimId: string, adminId: string, notes: string) => void;
  releaseItem: (itemId: string, adminId: string) => void;
  logItem: (item: Omit<FoundItem, 'id' | 'loggedAt' | 'auditLog' | 'status' | 'custodyStatus'>) => void;
}
```

---

## 5. Page & Component Refactor

### 5.1 `/board` — Lost Items Board (minimal changes)

- Remove any wallet-connect gate.
- Add filter by `status` (show only `available` and `under_review` by default).
- Each card links to `/claim/[id]`.

### 5.2 `/claim/[id]` — Claim Request Form (full rewrite)

**Replace:** `QrScanner` + `VerifyOwnershipPanel`

**New component: `ClaimRequestForm`**

```tsx
// Inputs
<input name="studentId"         label="Student ID" />
<input name="studentName"       label="Full Name" />
<input name="contactInfo"       label="Email or Phone" />
<textarea name="proofDescription"
  label="Describe your item (color, brand, markings, contents, etc.)"
  helperText="Be as specific as possible. This is how staff will verify you own this item."
/>
<button type="submit">Submit Claim Request</button>
```

On submit: call `submitClaim()` from context, show a **Claim Ticket** with a reference number.

> **No wallet, no QR, no cryptographic interaction.**

### 5.3 `/my-claims` — Claim Status Page (new route)

Simple lookup: student enters their Student ID → see all their submitted claims and current status (pending / approved / rejected).

### 5.4 `/wallet` → Repurpose or Delete

The `/wallet` route no longer makes sense. Options:
- **Delete** and redirect to `/my-claims`.
- **Repurpose** as a `/profile` page where students see claim history by Student ID lookup.

### 5.5 Admin Panel — `app/components/AdminItemForm.tsx`

**Remove:** `ownerAddress` input field

**Add:**
- `custodyStatus` dropdown: `held` / `released`
- Claim queue view: list of pending `ClaimRequest` entries for this item
- Per-claim action buttons: `Approve` / `Reject` (with notes field)
- `Release Item` button (only enabled after a claim is approved)

### 5.6 `app/components/HowItWorks.tsx` (full rewrite)

Remove all wallet/QR step descriptions. Replace with the school-managed flow:

1. Finder brings item to desk or submits via form.
2. Admin logs it with photo and description.
3. Item appears on the public board.
4. Student finds their item and submits a Claim Request with their Student ID.
5. Staff Reviews the claim and verifies identity + description.
6. Student collects item in person with campus ID.

### 5.7 Navigation

**Remove:** `WalletConnect` button, "My QR" link

**Add:** "My Claims" link (Student ID lookup), Admin login link

---

## 6. On-Chain Logging (Admin Only)

Cardano transactions remain in the system but are triggered **only by admin actions**, not by students.

Suggested events to anchor on-chain:

| Event | Metadata Key | Triggered By |
|---|---|---|
| Item logged | `verifind.item.logged` | Admin on item creation |
| Claim approved | `verifind.claim.approved` | Admin on claim approval |
| Item returned | `verifind.item.returned` | Admin on item release |

All three write a Cardano transaction with metadata via MeshJS from a **school-controlled wallet** — not the student's wallet. This preserves the immutable audit trail without requiring students to own wallets.

Re-add MeshJS for admin use only:

```bash
npm install @meshsdk/core @meshsdk/react
```

Wrap MeshJS usage behind an admin-authenticated route so it is never exposed to the student-facing UI.

---

## 7. Backend & Persistence (Phase 5)

The current app uses mock data. When adding a real backend:

### Recommended stack addition

| Layer | Suggestion |
|---|---|
| Database | PostgreSQL or SQLite (via Prisma) |
| API | Next.js Route Handlers (`app/api/`) |
| Auth (Admin) | NextAuth.js with credentials provider |
| Student ID lookup | Optional: CIT-U student directory API or manual cross-check |

### Key API routes to build

```
POST   /api/items            → Admin logs a new item
GET    /api/items            → Public board listing
POST   /api/claims           → Student submits a claim request
GET    /api/claims?studentId → Student views own claims
PATCH  /api/claims/[id]      → Admin approves/rejects a claim
POST   /api/items/[id]/release → Admin releases item, triggers on-chain log
```

---

## 8. Phased Execution Plan

| Phase | Work | Priority |
|---|---|---|
| 1 | Delete wallet/QR files; update `HowItWorks`; update nav | Immediate |
| 2 | Rewrite `ClaimRequestForm`; rewrite `/claim/[id]` page | Immediate |
| 3 | Update data model (`itemTypes.ts`, `mockItemsData.ts`, `ItemsProvider`) | Immediate |
| 4 | Build admin claim queue + approval/rejection UI in `AdminItemForm` | High |
| 5 | Add `/my-claims` page | High |
| 6 | Add real backend (API routes + DB) | Medium |
| 7 | Re-integrate MeshJS for admin-side on-chain logging | Medium |
| 8 | Optional: email/SMS claim notifications | Low |

---

## 9. Ownership Verification — Design Notes

The core question: **"How do we know the claimant actually owns the item?"**

### The answer: multi-factor institutional verification

1. **Student ID** — proves the person is a registered CIT-U student and ties the claim to a real, accountable campus identity.
2. **Descriptive proof** — the claimant must describe specific details about the item (brand, color, serial number, contents, distinguishing marks) that only the real owner would plausibly know.
3. **Physical pickup** — the student must appear in person with their campus ID card to collect the item. No remote release.
4. **Staff judgment** — admin staff cross-check all three against the physical item and school records before approving.

This is intentionally human-in-the-loop. Unlike a cryptographic proof, it cannot be automated away — and that is a feature, not a limitation. A bad actor would need to: know the item's specific details, have a valid Student ID that matches, and physically impersonate a registered student in front of staff.

### What the blockchain adds

On-chain anchoring makes the approval record **tamper-resistant**. Even if the application database is modified, the on-chain transaction timestamp and metadata provide an independent record of when the item was logged and when the claim was approved. This is the appropriate, minimal use of blockchain in an institutional system.

---

## 10. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Student describes item well enough to fake ownership | Low | Staff physically inspect item; require photo ID pickup |
| Admin approves wrong claim | Low | Dual-approval for high-value items; audit log for accountability |
| Student ID entered by wrong person | Low | Pickup requires physical campus ID; claim is tied to person, not session |
| Database tampered with | Low | On-chain anchors for key events provide independent verification |
| No-show after approval | Medium | Set a release window (e.g., 3 days); return to registry if uncollected |
