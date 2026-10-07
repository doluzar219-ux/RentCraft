import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Agreement,
  Application,
  KycRecord,
  Property,
  Role,
  Toast,
  UserSession,
  View,
} from "../types";
import { SEED_AGREEMENTS, SEED_APPLICATIONS, SEED_PROPERTIES } from "./seed";
import { agreementId, defaultClauses, defaultDates, deriveStatus, uid } from "../utils/agreement";

/* ── persistent state hook ─────────────────────────────────────── */
function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw) as T;
    } catch {
      /* corrupted storage — fall back to seed */
    }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full / private mode — non-fatal */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

/* ── context shape ─────────────────────────────────────────────── */
interface AppContextValue {
  role: Role;
  setRole: (r: Role) => void;
  session: UserSession | null;
  login: (name: string, email: string, role: Role) => void;
  logout: () => void;
  view: View;
  enterApp: () => void;
  exitApp: () => void;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;

  kyc: KycRecord | null;
  completeKyc: (rec: KycRecord) => void;

  properties: Property[];
  addProperty: (p: Omit<Property, "id" | "createdAt" | "tint" | "status">) => Property;
  applications: Application[];
  agreements: Agreement[];
  applyForLease: (propertyId: string) => { agreement: Agreement; created: boolean };
  declineApplication: (applicationId: string) => void;
  updateAgreement: (id: string, patch: Partial<Agreement>) => void;
  signAgreement: (id: string, party: Role, dataUrl: string) => void;

  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/* ── provider ──────────────────────────────────────────────────── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = usePersistentState<Role>("rc_role", "landlord");
  const [session, setSession] = usePersistentState<UserSession | null>("rc_session", null);
  const [kyc, setKyc] = usePersistentState<KycRecord | null>("rc_kyc", null);
  const [properties, setProperties] = usePersistentState<Property[]>("rc_properties", SEED_PROPERTIES);
  const [applications, setApplications] = usePersistentState<Application[]>("rc_applications", SEED_APPLICATIONS);
  const [agreements, setAgreements] = usePersistentState<Agreement[]>("rc_agreements", SEED_AGREEMENTS);
  const [view, setView] = useState<View>("landing");
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setRole = useCallback(
    (r: Role) => {
      setRoleState(r);
      setSession((s) => (s ? { ...s, role: r } : s));
    },
    [setRoleState, setSession]
  );

  const enterApp = useCallback(() => {
    setView("app");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, []);

  const exitApp = useCallback(() => {
    setView("landing");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, []);

  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const login = useCallback(
    (name: string, email: string, r: Role) => {
      setSession({ id: uid("u-"), name, email, role: r, createdAt: new Date().toISOString() });
      setRoleState(r);
      setAuthOpen(false);
      setView("app");
      requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    },
    [setSession, setRoleState]
  );

  const logout = useCallback(() => {
    setSession(null);
    setKyc(null);
    setView("landing");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, [setSession, setKyc]);

  const completeKyc = useCallback((rec: KycRecord) => setKyc(rec), [setKyc]);

  /* ── toasts ── */
  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, tone: Toast["tone"] = "forest") => {
      const id = uid("t-");
      setToasts((t) => [...t.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast]
  );

  /* ── properties ── */
  const addProperty = useCallback(
    (data: Omit<Property, "id" | "createdAt" | "tint" | "status">): Property => {
      const tints: Property["tint"][] = ["terracotta", "forest", "sand"];
      const prop: Property = {
        ...data,
        id: uid("p-"),
        status: "available",
        tint: tints[Math.floor(Math.random() * tints.length)],
        createdAt: new Date().toISOString(),
      };
      setProperties((list) => [prop, ...list]);
      return prop;
    },
    [setProperties]
  );

  /* ── apply for lease → instantly drafts an agreement ── */
  const applyForLease = useCallback(
    (propertyId: string): { agreement: Agreement; created: boolean } => {
      const prop = properties.find((p) => p.id === propertyId);
      if (!prop) throw new Error("Property not found");
      const tenantName = session?.name ?? "Guest Tenant";
      const landlordName = prop.ownerName;

      const existing = agreements.find(
        (a) => a.propertyId === propertyId && a.tenantName === tenantName
      );
      if (existing) return { agreement: existing, created: false };

      const id = agreementId();
      const { startDate, endDate } = defaultDates();
      const agreement: Agreement = {
        id,
        propertyId: prop.id,
        propertyTitle: prop.title,
        propertyAddress: `${prop.title.split("·")[0].trim()}, ${prop.location}`,
        rent: prop.rent,
        deposit: prop.deposit,
        tenantName,
        landlordName,
        startDate,
        endDate,
        clauses: defaultClauses(prop.rent, prop.deposit),
        createdAt: new Date().toISOString(),
        tenantSignature: null,
        landlordSignature: null,
      };
      setAgreements((list) => [agreement, ...list]);
      setApplications((list) => [
        {
          id: uid("app-"),
          propertyId: prop.id,
          propertyTitle: prop.title,
          tenantName,
          trustScore: kyc?.trustScore ?? 91,
          status: "sent",
          agreementId: id,
          createdAt: new Date().toISOString(),
        },
        ...list,
      ]);
      setProperties((list) =>
        list.map((p) => (p.id === propertyId ? { ...p, status: "requested" } : p))
      );
      return { agreement, created: true };
    },
    [properties, agreements, session, kyc, setAgreements, setApplications, setProperties]
  );

  const declineApplication = useCallback(
    (applicationId: string) => {
      const app = applications.find((a) => a.id === applicationId);
      if (!app) return;
      setApplications((list) =>
        list.map((a) => (a.id === applicationId ? { ...a, status: "declined" } : a))
      );
      setAgreements((list) => list.filter((a) => a.id !== app.agreementId));
      setProperties((list) =>
        list.map((p) =>
          p.id === app.propertyId && p.status === "requested" ? { ...p, status: "available" } : p
        )
      );
    },
    [applications, setApplications, setAgreements, setProperties]
  );

  const updateAgreement = useCallback(
    (id: string, patch: Partial<Agreement>) => {
      setAgreements((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    },
    [setAgreements]
  );

  const signAgreement = useCallback(
    (id: string, party: Role, dataUrl: string) => {
      const sig = { dataUrl, at: new Date().toISOString() };
      setAgreements((list) =>
        list.map((a) =>
          a.id === id
            ? { ...a, [party === "tenant" ? "tenantSignature" : "landlordSignature"]: sig }
            : a
        )
      );
      setApplications((list) =>
        list.map((app) => (app.agreementId === id ? { ...app, status: "approved" } : app))
      );
      // if both parties have now signed, mark property as rented
      const after = agreements.find((a) => a.id === id);
      if (after) {
        const t = party === "tenant" ? sig : after.tenantSignature;
        const l = party === "landlord" ? sig : after.landlordSignature;
        if (t && l) {
          setProperties((list) =>
            list.map((p) => (p.id === after.propertyId ? { ...p, status: "rented" } : p))
          );
        }
      }
    },
    [agreements, setAgreements, setApplications, setProperties]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      setRole,
      session,
      login,
      logout,
      view,
      enterApp,
      exitApp,
      authOpen,
      openAuth,
      closeAuth,
      kyc,
      completeKyc,
      properties,
      addProperty,
      applications,
      agreements,
      applyForLease,
      declineApplication,
      updateAgreement,
      signAgreement,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      role, setRole, session, login, logout, view, enterApp, exitApp, authOpen, openAuth,
      closeAuth, kyc, completeKyc, properties, addProperty, applications, agreements,
      applyForLease, declineApplication, updateAgreement, signAgreement, toasts, pushToast, dismissToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/* re-export for convenience */
export { deriveStatus };
