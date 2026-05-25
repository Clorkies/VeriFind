"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { AuditEntry, ClaimRequest, FoundItem, ItemStatus } from "@/lib/itemTypes";
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
  ) => Promise<void>;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
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
        category: item.category as any,
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
            action: log.action as any,
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
        status: claim.status as any,
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
  };

  useEffect(() => {
    fetchData();

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
      supabase.removeChannel(channel);
    };
  }, []);

  const logItem: ItemsContextType["logItem"] = async (item) => {
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
  };

  const submitClaim: ItemsContextType["submitClaim"] = async (claim) => {
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

    // Update item status
    await supabase
      .from("items")
      .update({ status: "under_review" })
      .eq("id", claim.itemId);

    // Add audit log
    await supabase.from("audit_logs").insert({
      item_id: claim.itemId,
      action: "claimed",
      actor: claim.studentId,
      notes: "Claim request submitted.",
    });

    return newClaim.id;
  };

  const approveClaim: ItemsContextType["approveClaim"] = async (
    claimId,
    adminId,
    notes,
  ) => {
    const { data: claim, error: fetchError } = await supabase
      .from("claims")
      .select("item_id")
      .eq("id", claimId)
      .single();

    if (fetchError) throw fetchError;

    const reviewedAt = new Date().toISOString();

    await supabase
      .from("claims")
      .update({
        status: "approved",
        reviewed_by: adminId,
        reviewed_at: reviewedAt,
        review_notes: notes,
      })
      .eq("id", claimId);

    await supabase.from("audit_logs").insert({
      item_id: claim.item_id,
      action: "approved",
      actor: adminId,
      notes,
    });
  };

  const rejectClaim: ItemsContextType["rejectClaim"] = async (
    claimId,
    adminId,
    notes,
  ) => {
    const { data: claim, error: fetchError } = await supabase
      .from("claims")
      .select("item_id")
      .eq("id", claimId)
      .single();

    if (fetchError) throw fetchError;

    const reviewedAt = new Date().toISOString();

    await supabase
      .from("claims")
      .update({
        status: "rejected",
        reviewed_by: adminId,
        reviewed_at: reviewedAt,
        review_notes: notes,
      })
      .eq("id", claimId);

    // Check if there are other active claims
    const { data: otherClaims } = await supabase
      .from("claims")
      .select("id")
      .eq("item_id", claim.item_id)
      .neq("id", claimId)
      .in("status", ["pending", "approved"]);

    const hasActiveClaim = (otherClaims?.length || 0) > 0;

    await supabase
      .from("items")
      .update({ status: hasActiveClaim ? "under_review" : "available" })
      .eq("id", claim.item_id);

    await supabase.from("audit_logs").insert({
      item_id: claim.item_id,
      action: "rejected",
      actor: adminId,
      notes,
    });
  };

  const releaseItem: ItemsContextType["releaseItem"] = async (itemId, adminId) => {
    await supabase
      .from("items")
      .update({
        status: "returned",
        custody_status: "released",
      })
      .eq("id", itemId);

    await supabase.from("audit_logs").insert({
      item_id: itemId,
      action: "released",
      actor: adminId,
      notes: "Item released to verified student.",
    });
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
