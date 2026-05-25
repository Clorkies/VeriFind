"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type {
  AuditEntry,
  ClaimRequest,
  FoundItem,
  ItemCategory,
  ItemStatus,
} from "@/lib/itemTypes";
import { createClient } from "@/lib/supabase/client";

type ItemsContextType = {
  items: FoundItem[];
  claims: ClaimRequest[];
  loading: boolean;
  submitClaim: (
    claim: Omit<ClaimRequest, "claimId" | "submittedAt" | "status">
  ) => Promise<string | null>;
  approveClaim: (claimId: string, adminId: string, notes?: string) => Promise<void>;
  rejectClaim: (claimId: string, adminId: string, notes: string) => Promise<void>;
  releaseItem: (itemId: string, adminId: string) => Promise<void>;
  logItem: (
    item: Omit<
      FoundItem,
      "id" | "loggedAt" | "auditLog" | "status"
    >
  ) => Promise<{ itemId: string; txHash?: string; anchorError?: string }>;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const inFlight = useRef(new Set<string>());
  const lastActionAt = useRef(new Map<string, number>());

  const guardAction = (key: string, cooldownMs: number) => {
    const now = Date.now();
    if (inFlight.current.has(key)) {
      throw new Error("Request already in progress.");
    }
    const last = lastActionAt.current.get(key) ?? 0;
    const remaining = cooldownMs - (now - last);
    if (remaining > 0) {
      throw new Error(
        `Please wait ${Math.ceil(remaining / 1000)}s before trying again.`,
      );
    }
    inFlight.current.add(key);
    lastActionAt.current.set(key, now);
    return () => inFlight.current.delete(key);
  };

  const anchorLedger = async (payload: {
    event: "item.logged" | "claim.approved" | "item.returned";
    itemId: string;
    claimId?: string;
    adminId: string;
  }) => {
    const response = await fetch("/api/ledger/anchor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let data: { txHash?: string; error?: string } | null = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    if (!response.ok || !data?.txHash) {
      const message = data?.error ?? "Failed to anchor on-chain.";
      throw new Error(message);
    }
    return data.txHash;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .order("logged_at", { ascending: false });

      // Fetch claims
      const { data: claimsData, error: claimsError } = await supabase
        .from("claims")
        .select("*")
        .order("submitted_at", { ascending: false });

      // Fetch audit logs for items
      const { data: auditData, error: auditError } = await supabase
        .from("audit_logs")
        .select("*")
        .order("timestamp", { ascending: true });

      if (itemsError || claimsError || auditError) {
        console.error("Error fetching data:", itemsError || claimsError || auditError);
        return;
      }

      // Map Supabase items to FoundItem type
      const mappedItems: FoundItem[] = (itemsData || []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        hiddenDescription: item.hidden_description,
        category: item.category as ItemCategory,
        locationFound: item.location_found,
        dateFound: item.date_found,
        photoUrl: item.photo_url,
        status: item.status as ItemStatus,
        custodyStatus: item.custody_status as "held" | "released",
        loggedBy: item.logged_by,
        loggedAt: item.logged_at,
        txHash: item.tx_hash,
        auditLog: (auditData || [])
          .filter((log) => log.item_id === item.id)
          .map((log) => ({
            timestamp: log.timestamp,
            action: log.action as AuditEntry["action"],
            actor: log.actor,
            notes: log.notes,
          })),
      }));

      // Map Supabase claims to ClaimRequest type
      const mappedClaims: ClaimRequest[] = (claimsData || []).map((claim) => ({
        claimId: claim.id,
        itemId: claim.item_id,
        studentId: claim.student_id,
        studentName: claim.student_name,
        contactInfo: claim.contact_info,
        proofDescription: claim.proof_description,
        status: claim.status as ClaimRequest["status"],
        submittedAt: claim.submitted_at,
        reviewedBy: claim.reviewed_by,
        reviewedAt: claim.reviewed_at,
        reviewNotes: claim.review_notes,
      }));

      setItems(mappedItems);
      setClaims(mappedClaims);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    // Subscribe to changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  const logItem: ItemsContextType["logItem"] = async (item) => {
    const release = guardAction("log-item", 5000);
    try {
      const status: ItemStatus =
        item.custodyStatus === "released" ? "returned" : "available";

      const { data: newItem, error: itemError } = await supabase
        .from("items")
        .insert({
          name: item.name,
          description: item.description,
          hidden_description: item.hiddenDescription,
          category: item.category,
          location_found: item.locationFound,
          date_found: item.dateFound,
          photo_url: item.photoUrl,
          status,
          custody_status: item.custodyStatus,
          logged_by: item.loggedBy,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      await supabase.from("audit_logs").insert({
        item_id: newItem.id,
        action: "logged",
        actor: item.loggedBy,
        notes: "Item logged by Lost & Found staff.",
      });

      try {
        const txHash = await anchorLedger({
          event: "item.logged",
          itemId: newItem.id,
          adminId: item.loggedBy,
        });
        await supabase
          .from("items")
          .update({ tx_hash: txHash })
          .eq("id", newItem.id);
        return { itemId: newItem.id, txHash };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "On-chain anchor failed.";
        return { itemId: newItem.id, anchorError: message };
      }
    } finally {
      release();
    }
  };

  const submitClaim: ItemsContextType["submitClaim"] = async (claim) => {
    const release = guardAction(
      `claim:${claim.itemId}:${claim.studentId}`,
      8000,
    );
    try {
      const { data: existingClaims, error: existingError } = await supabase
        .from("claims")
        .select("id, submitted_at, status")
        .eq("item_id", claim.itemId)
        .eq("student_id", claim.studentId)
        .in("status", ["pending", "approved"])
        .order("submitted_at", { ascending: false })
        .limit(1);

      if (existingError) throw existingError;

      if (existingClaims && existingClaims.length > 0) {
        throw new Error("A claim is already pending or approved for this item.");
      }

      const { data: newClaim, error: claimError } = await supabase
        .from("claims")
        .insert({
          item_id: claim.itemId,
          student_id: claim.studentId,
          student_name: claim.studentName,
          contact_info: claim.contactInfo,
          proof_description: claim.proofDescription,
          status: "pending",
        })
        .select()
        .single();

      if (claimError) throw claimError;

      const { error: updateError } = await supabase
        .from("items")
        .update({ status: "under_review" })
        .eq("id", claim.itemId);

      if (updateError) throw updateError;

      const { error: auditError } = await supabase.from("audit_logs").insert({
        item_id: claim.itemId,
        action: "claimed",
        actor: claim.studentId,
        notes: "Claim request submitted.",
      });

      if (auditError) {
        console.error("Audit log failed:", auditError);
      }

      const mappedClaim: ClaimRequest = {
        claimId: newClaim.id,
        itemId: newClaim.item_id,
        studentId: newClaim.student_id,
        studentName: newClaim.student_name,
        contactInfo: newClaim.contact_info,
        proofDescription: newClaim.proof_description,
        status: newClaim.status as ClaimRequest["status"],
        submittedAt: newClaim.submitted_at,
        reviewedBy: newClaim.reviewed_by ?? undefined,
        reviewedAt: newClaim.reviewed_at ?? undefined,
        reviewNotes: newClaim.review_notes ?? undefined,
      };

      setClaims((prev) =>
        prev.some((entry) => entry.claimId === mappedClaim.claimId)
          ? prev
          : [mappedClaim, ...prev],
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === claim.itemId && item.status === "available"
            ? { ...item, status: "under_review" }
            : item,
        ),
      );

      return newClaim.id;
    } finally {
      release();
    }
  };

  const approveClaim: ItemsContextType["approveClaim"] = async (
    claimId,
    adminId,
    notes,
  ) => {
    const release = guardAction(`approve:${claimId}`, 3000);
    try {
      const { data: claim, error: fetchError } = await supabase
        .from("claims")
        .select("item_id")
        .eq("id", claimId)
        .single();

      if (fetchError) throw fetchError;

      const reviewedAt = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("claims")
        .update({
          status: "approved",
          reviewed_by: adminId,
          reviewed_at: reviewedAt,
          review_notes: notes,
        })
        .eq("id", claimId);

      if (updateError) {
        throw new Error(`Failed to approve claim: ${updateError.message}`);
      }

      await supabase.from("audit_logs").insert({
        item_id: claim.item_id,
        action: "approved",
        actor: adminId,
        notes,
      });

      setClaims((prev) =>
        prev.map((entry) =>
          entry.claimId === claimId
            ? {
                ...entry,
                status: "approved",
                reviewedBy: adminId,
                reviewedAt,
                reviewNotes: notes,
              }
            : entry,
        ),
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === claim.item_id && item.status === "available"
            ? { ...item, status: "under_review" }
            : item,
        ),
      );

      const txHash = await anchorLedger({
        event: "claim.approved",
        itemId: claim.item_id,
        claimId,
        adminId,
      });
      await supabase
        .from("items")
        .update({ tx_hash: txHash })
        .eq("id", claim.item_id);
    } finally {
      release();
    }
  };

  const rejectClaim: ItemsContextType["rejectClaim"] = async (
    claimId,
    adminId,
    notes,
  ) => {
    const release = guardAction(`reject:${claimId}`, 3000);
    try {
      const { data: claim, error: fetchError } = await supabase
        .from("claims")
        .select("item_id")
        .eq("id", claimId)
        .single();

      if (fetchError) throw fetchError;

      const reviewedAt = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("claims")
        .update({
          status: "rejected",
          reviewed_by: adminId,
          reviewed_at: reviewedAt,
          review_notes: notes,
        })
        .eq("id", claimId);

      if (updateError) throw new Error(`Failed to reject claim: ${updateError.message}`);

      // Check if there are other active claims
      const { data: otherClaims } = await supabase
        .from("claims")
        .select("id")
        .eq("item_id", claim.item_id)
        .neq("id", claimId)
        .in("status", ["pending", "approved"]);

      const hasActiveClaim = (otherClaims?.length || 0) > 0;

      const { error: itemUpdateError } = await supabase
        .from("items")
        .update({ status: hasActiveClaim ? "under_review" : "available" })
        .eq("id", claim.item_id);

      if (itemUpdateError) {
        throw new Error(`Failed to update item status: ${itemUpdateError.message}`);
      }

      await supabase.from("audit_logs").insert({
        item_id: claim.item_id,
        action: "rejected",
        actor: adminId,
        notes,
      });

      setClaims((prev) =>
        prev.map((entry) =>
          entry.claimId === claimId
            ? {
                ...entry,
                status: "rejected",
                reviewedBy: adminId,
                reviewedAt,
                reviewNotes: notes,
              }
            : entry,
        ),
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === claim.item_id
            ? { ...item, status: hasActiveClaim ? "under_review" : "available" }
            : item,
        ),
      );
    } finally {
      release();
    }
  };

  const releaseItem: ItemsContextType["releaseItem"] = async (itemId, adminId) => {
    const release = guardAction(`release:${itemId}`, 5000);
    try {
      const { error: releaseError } = await supabase
        .from("items")
        .update({
          status: "returned",
          custody_status: "released",
        })
        .eq("id", itemId);

      if (releaseError) {
        throw new Error(`Failed to release item: ${releaseError.message}`);
      }

      await supabase.from("audit_logs").insert({
        item_id: itemId,
        action: "released",
        actor: adminId,
        notes: "Item released to verified student.",
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: "returned", custodyStatus: "released" }
            : item,
        ),
      );

      const txHash = await anchorLedger({
        event: "item.returned",
        itemId,
        adminId,
      });
      await supabase.from("items").update({ tx_hash: txHash }).eq("id", itemId);
    } finally {
      release();
    }
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        loading,
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
