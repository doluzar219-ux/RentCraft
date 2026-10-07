import type { Agreement, Application, Property } from "../types";
import { agreementId, defaultClauses, defaultDates } from "../utils/agreement";

export const SEED_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Sunrise Residency · 2BHK",
    location: "Koramangala, Bengaluru",
    rent: 24000,
    deposit: 72000,
    type: "2BHK",
    ownerName: "Rohan Kulkarni",
    status: "available",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tint: "terracotta",
  },
  {
    id: "p2",
    title: "Maple Court · Studio",
    location: "Indiranagar, Bengaluru",
    rent: 16500,
    deposit: 50000,
    type: "Studio",
    ownerName: "Sana Sheikh",
    status: "available",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    tint: "forest",
  },
  {
    id: "p3",
    title: "Willow Lane · 3BHK",
    location: "HSR Layout, Bengaluru",
    rent: 41000,
    deposit: 120000,
    type: "3BHK",
    ownerName: "Arjun Nair",
    status: "requested",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    tint: "sand",
  },
  {
    id: "p4",
    title: "Terrace Meadows · 1BHK",
    location: "Baner, Pune",
    rent: 14800,
    deposit: 45000,
    type: "1BHK",
    ownerName: "Rohan Kulkarni",
    status: "available",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tint: "forest",
  },
];

const dates = defaultDates();

export const SEED_AGREEMENT_ID = agreementId();

export const SEED_AGREEMENTS: Agreement[] = [
  {
    id: SEED_AGREEMENT_ID,
    propertyId: "p3",
    propertyTitle: "Willow Lane · 3BHK",
    propertyAddress: "Willow Lane, HSR Layout, Bengaluru 560102",
    rent: 41000,
    deposit: 120000,
    tenantName: "Meera Iyer",
    landlordName: "Arjun Nair",
    startDate: dates.startDate,
    endDate: dates.endDate,
    clauses: defaultClauses(41000, 120000),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tenantSignature: null,
    landlordSignature: null,
  },
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: "app-seed-1",
    propertyId: "p3",
    propertyTitle: "Willow Lane · 3BHK",
    tenantName: "Meera Iyer",
    trustScore: 96,
    status: "sent",
    agreementId: SEED_AGREEMENT_ID,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "app-seed-2",
    propertyId: "p2",
    propertyTitle: "Maple Court · Studio",
    tenantName: "Kabir Shah",
    trustScore: 88,
    status: "sent",
    agreementId: "",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];
