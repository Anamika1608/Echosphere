import { create } from "zustand";
import type { PgCommunity, RaisedIssue, RequestedService, User } from "@/types";

// Initial PG Community object
const initialPgCommunity: PgCommunity = {
  id: "",
  name: "",
  address: "",
  pgCode: "",
  ownerId: "",
  owner: {} as User,
  residents: [],
  issues: [],
  services: [],
  technicians: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface PgCommunityStoreState {
  pgCommunities: PgCommunity[]; // All PG communities (owner can have multiple)
  selectedPgCommunity: PgCommunity | null; // The PG currently being viewed
  isLoading: boolean;

  setPgCommunities: (communities: PgCommunity[]) => void;
  addPgCommunity: (community: PgCommunity) => void;
  updatePgCommunity: (id: string, updates: Partial<PgCommunity>) => void;
  removePgCommunity: (id: string) => void;

  selectPgCommunity: (id: string) => void;

  // Functions for managing issues
  addIssue: (pgId: string, issue: RaisedIssue) => void;
  removeIssue: (pgId: string, issueId: string) => void;

  // Functions for managing services
  addService: (pgId: string, service: RequestedService) => void;
  removeService: (pgId: string, serviceId: string) => void;

  // Functions for managing technicians
//   addTechnician: (pgId: string, tech: TechnicianPgAssignment) => void;
//   removeTechnician: (pgId: string, techId: string) => void;

  setLoading: (loading: boolean) => void;
}

const pgCommunityStore = create<PgCommunityStoreState>((set) => ({
  pgCommunities: [],
  selectedPgCommunity: null,
  isLoading: false,

  setPgCommunities: (communities) => set({ pgCommunities: communities }),

  addPgCommunity: (community) =>
    set((state) => ({
      pgCommunities: [...state.pgCommunities, community],
    })),

  updatePgCommunity: (id, updates) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.map((pg) =>
        pg.id === id ? { ...pg, ...updates } : pg
      ),
    })),

  removePgCommunity: (id) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.filter((pg) => pg.id !== id),
    })),

  selectPgCommunity: (id) =>
    set((state) => ({
      selectedPgCommunity: state.pgCommunities.find((pg) => pg.id === id) || null,
    })),

  // Issues
  addIssue: (pgId, issue) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.map((pg) =>
        pg.id === pgId ? { ...pg, issues: [...pg.issues, issue] } : pg
      ),
    })),

  removeIssue: (pgId, issueId) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.map((pg) =>
        pg.id === pgId
          ? { ...pg, issues: pg.issues.filter((i) => i.id !== issueId) }
          : pg
      ),
    })),

  // Services
  addService: (pgId, service) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.map((pg) =>
        pg.id === pgId ? { ...pg, services: [...pg.services, service] } : pg
      ),
    })),

  removeService: (pgId, serviceId) =>
    set((state) => ({
      pgCommunities: state.pgCommunities.map((pg) =>
        pg.id === pgId
          ? { ...pg, services: pg.services.filter((s) => s.id !== serviceId) }
          : pg
      ),
    })),

  // Technicians
//   addTechnician: (pgId, tech) =>
//     set((state) => ({
//       pgCommunities: state.pgCommunities.map((pg) =>
//         pg.id === pgId ? { ...pg, technicians: [...pg.technicians, tech] } : pg
//       ),
//     })),

//   removeTechnician: (pgId, techId) =>
//     set((state) => ({
//       pgCommunities: state.pgCommunities.map((pg) =>
//         pg.id === pgId
//           ? { ...pg, technicians: pg.technicians.filter((t) => t.id !== techId) }
//           : pg
//       ),
//     })),

  setLoading: (loading) => set({ isLoading: loading }),
}));

export default pgCommunityStore;
