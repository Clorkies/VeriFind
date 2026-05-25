"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { AuditEntry, ClaimRequest, FoundItem, ItemStatus } from "@/lib/itemTypes";
import { MOCK_ITEMS } from "@/lib/mockItems";

type ItemsContextType = {
  items: FoundItem[];
  claims: ClaimRequest[];
  submitClaim: (
    claim: Omit<ClaimRequest, "claimId" | "submittedAt" | "status">
  ) => string;
  approveClaim: (claimId: string, adminId: string, notes?: string) => void;
  rejectClaim: (claimId: string, adminId: string, notes: string) => void;
  releaseItem: (itemId: string, adminId: string) => void;
  logItem: (
    item: Omit<
      FoundItem,
      "id" | "loggedAt" | "auditLog" | "status"
    >
  ) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FoundItem[]>(MOCK_ITEMS);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);

  const createId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

  const logItem: ItemsContextType["logItem"] = (item) => {
    const timestamp = new Date().toISOString();
    const status: ItemStatus =
      item.custodyStatus === "released" ? "returned" : "available";
    const loggedEntry: AuditEntry = {
      timestamp,
      action: "logged",
      actor: item.loggedBy,
      notes: "Item logged by Lost & Found staff.",
    };
    const newItem: FoundItem = {
      ...item,
      id: createId(),
      status,
      loggedAt: timestamp,
      auditLog: [loggedEntry],
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const submitClaim: ItemsContextType["submitClaim"] = (claim) => {
    const submittedAt = new Date().toISOString();
    const claimId = createId();
    const newClaim: ClaimRequest = {
      ...claim,
      claimId,
      status: "pending",
      submittedAt,
    };
    setClaims((prev) => [newClaim, ...prev]);
    setItems((prev) =>
      prev.map((item) =>
        item.id === claim.itemId
          ? {
              ...item,
              status: "under_review",
              auditLog: [
                ...item.auditLog,
                {
                  timestamp: submittedAt,
                  action: "claimed",
                  actor: claim.studentId,
                  notes: "Claim request submitted.",
            } satisfies AuditEntry,
              ],
            }
          : item,
      ),
    );
    return claimId;
  };

  const approveClaim: ItemsContextType["approveClaim"] = (
    claimId,
    adminId,
    notes,
  ) => {
    const reviewedAt = new Date().toISOString();
    let targetClaim: ClaimRequest | undefined;
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.claimId !== claimId) return claim;
        targetClaim = { ...claim, status: "approved", reviewedBy: adminId };
        return {
          ...claim,
          status: "approved",
          reviewedBy: adminId,
          reviewedAt,
          reviewNotes: notes,
        };
      }),
    );
    if (!targetClaim) return;
    const approvalEntry: AuditEntry = {
      timestamp: reviewedAt,
      action: "approved",
      actor: adminId,
      notes,
    };
    setItems((prev) =>
      prev.map((item) =>
        item.id === targetClaim?.itemId
          ? {
              ...item,
              status: "under_review",
              auditLog: [...item.auditLog, approvalEntry],
            }
          : item,
      ),
    );
  };

  const rejectClaim: ItemsContextType["rejectClaim"] = (
    claimId,
    adminId,
    notes,
  ) => {
    const reviewedAt = new Date().toISOString();
    let targetClaim: ClaimRequest | undefined;
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.claimId !== claimId) return claim;
        targetClaim = { ...claim, status: "rejected", reviewedBy: adminId };
        return {
          ...claim,
          status: "rejected",
          reviewedBy: adminId,
          reviewedAt,
          reviewNotes: notes,
        };
      }),
    );
    if (!targetClaim) return;
    const rejectionEntry: AuditEntry = {
      timestamp: reviewedAt,
      action: "rejected",
      actor: adminId,
      notes,
    };
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== targetClaim?.itemId) return item;
        const nextAudit = [...item.auditLog, rejectionEntry];
        const hasActiveClaim = claims.some(
          (claim) =>
            claim.itemId === item.id &&
            claim.claimId !== claimId &&
            (claim.status === "pending" || claim.status === "approved"),
        );
        return {
          ...item,
          status: hasActiveClaim ? "under_review" : "available",
          auditLog: nextAudit,
        };
      }),
    );
  };

  const releaseItem: ItemsContextType["releaseItem"] = (itemId, adminId) => {
    const releasedAt = new Date().toISOString();
    const releaseEntry: AuditEntry = {
      timestamp: releasedAt,
      action: "released",
      actor: adminId,
      notes: "Item released to verified student.",
    };
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "returned",
              custodyStatus: "released",
              auditLog: [...item.auditLog, releaseEntry],
            }
          : item,
      ),
    );
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        submitClaim,
        approveClaim,
        rejectClaim,
        releaseItem,
        logItem,
      }}
    >
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
