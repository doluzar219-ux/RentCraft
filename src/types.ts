export type Role = "tenant" | "landlord";
export type View = "landing" | "app";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface KycRecord {
  name: string;
  aadhaar: string; // formatted "1234 5678 9012"
  pan: string;
  trustScore: number;
  verifiedAt: string;
}

export type PropertyStatus = "available" | "requested" | "rented";

export interface Property {
  id: string;
  title: string;
  location: string;
  rent: number;
  deposit: number;
  type: string;
  ownerName: string;
  status: PropertyStatus;
  createdAt: string;
  tint: "terracotta" | "forest" | "sand";
}

export type ApplicationStatus = "sent" | "approved" | "declined";

export interface Application {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  trustScore: number;
  status: ApplicationStatus;
  agreementId: string;
  createdAt: string;
}

export interface Signature {
  dataUrl: string;
  at: string;
}

export interface Agreement {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  rent: number;
  deposit: number;
  tenantName: string;
  landlordName: string;
  startDate: string;
  endDate: string;
  clauses: string[];
  createdAt: string;
  tenantSignature: Signature | null;
  landlordSignature: Signature | null;
}

export interface Toast {
  id: string;
  message: string;
  tone: "terra" | "forest" | "ink";
}
