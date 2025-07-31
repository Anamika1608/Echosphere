import { create } from 'zustand'

import type { User, RaisedIssue, RequestedService } from '@/types'

// Initial user state
const initialUser: User = {
  id: '',
  name: '',
  email: '',
  profilePicture: null,
  role: 'RESIDENT', // default role
  ownedPgCommunities: [],
  pgCommunity: null,
  pgCommunityId: null,
  raisedIssues: [],
  requestedServices: [],
};

// Zustand store types
interface StoreState {
  auth: {
    user: User;
    setUser: (newUser: User) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
  };
  addRaisedIssue: (issue: RaisedIssue) => void;
  removeRaisedIssue: (issueId: string) => void;
  addRequestedService: (service: RequestedService) => void;
  removeRequestedService: (serviceId: string) => void;
}

const userStore = create<StoreState>((set) => ({
  // Auth object (all user-related actions)
  auth: {
    user: initialUser,

    // Set entire user object
    setUser: (newUser) =>
      set((state) => ({
        auth: { ...state.auth, user: { ...newUser } },
      })),

    // Update specific user fields
    updateUser: (updates) =>
      set((state) => ({
        auth: { ...state.auth, user: { ...state.auth.user, ...updates } },
      })),

    // Clear user info
    clearUser: () =>
      set((state) => ({
        auth: { ...state.auth, user: initialUser },
      })),
  },

  // Raised Issues Functions
  addRaisedIssue: (issue) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          raisedIssues: [...(state.auth.user.raisedIssues ?? []), issue],
        },
      },
    })),

  removeRaisedIssue: (issueId) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          raisedIssues: (state.auth.user.raisedIssues ?? []).filter(
            (issue) => issue.id === undefined || issue.id !== issueId
          ),
        },
      },
    })),

  // Requested Services Functions
  addRequestedService: (service) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          requestedServices: [
            ...(state.auth.user.requestedServices ?? []),
            service,
          ],
        },
      },
    })),

  removeRequestedService: (serviceId) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          requestedServices: (state.auth.user.requestedServices ?? []).filter(
            (service) => service.id === undefined || service.id !== serviceId
          ),
        },
      },
    })),
}));

export default userStore;
