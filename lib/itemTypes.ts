export type ItemCategory = "electronics" | "books" | "valuables";

export type ItemStatus = "available" | "under_review" | "returned" | "unclaimed";

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface AuditEntry {
  timestamp: string;
  action: "logged" | "claimed" | "approved" | "rejected" | "released";
  actor: string;
  notes?: string;
}

export interface FoundItem {
  id: string;
  name: string;
  description: string;
  hiddenDescription?: string; // Private details for admin verification
  category: ItemCategory;
  locationFound: string;
  dateFound: string;
  photoUrl?: string;
  status: ItemStatus;
  custodyStatus: "held" | "released";
  loggedBy: string;
  loggedAt: string;
  auditLog: AuditEntry[];
  txHash?: string;
}

export interface ClaimRequest {
  claimId: string;
  itemId: string;
  studentId: string;
  studentName: string;
  contactInfo: string;
  proofDescription: string;
  status: ClaimStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AdminUser {
  adminId: string;
  name: string;
  role: "staff" | "supervisor";
  actionHistory: AuditEntry[];
}
