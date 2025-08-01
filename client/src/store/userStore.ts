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

interface StoreState {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (newUser: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  addRaisedIssue: (issue: RaisedIssue) => void;
  removeRaisedIssue: (issueId: string) => void;
  addRequestedService: (service: RequestedService) => void;
  removeRequestedService: (serviceId: string) => void;
}

const userStore = create<StoreState>((set) => ({
  // User state
  user: initialUser,
  isLoading: false,
  isAuthenticated: false,

  // Set loading state
  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  // Set entire user object
  setUser: (newUser) =>
    set(() => ({
      user: { ...newUser },
      isAuthenticated: Boolean(newUser.id),
      isLoading: false,
    })),

  // Update specific user fields
  updateUser: (updates) =>
    set((state) => {
      const updatedUser = { ...state.user, ...updates };
      return {
        user: updatedUser,
        isAuthenticated: Boolean(updatedUser.id),
      };
    }),

  // Clear user info
  clearUser: () =>
    set(() => ({
      user: initialUser,
      isAuthenticated: false,
      isLoading: false,
    })),

  // Raised Issues Functions
  addRaisedIssue: (issue) =>
    set((state) => ({
      user: {
        ...state.user,
        raisedIssues: [...(state.user.raisedIssues ?? []), issue],
      },
    })),

  removeRaisedIssue: (issueId) =>
    set((state) => ({
      user: {
        ...state.user,
        raisedIssues: (state.user.raisedIssues ?? []).filter(
          (issue) => issue.id === undefined || issue.id !== issueId
        ),
      },
    })),

  // Requested Services Functions
  addRequestedService: (service) =>
    set((state) => ({
      user: {
        ...state.user,
        requestedServices: [
          ...(state.user.requestedServices ?? []),
          service,
        ],
      },
    })),

  removeRequestedService: (serviceId) =>
    set((state) => ({
      user: {
        ...state.user,
        requestedServices: (state.user.requestedServices ?? []).filter(
          (service) => service.id === undefined || service.id !== serviceId
        ),
      },
    })),
}));

export default userStore;