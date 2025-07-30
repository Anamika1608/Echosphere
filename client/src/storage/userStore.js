import { create } from 'zustand'

const initialUser = {
  name: '',
  email: '',
  password: '',
  profilePicture: null,
  role: '',
  pgCommunityId: null,
  raisedIssues: [],
  requestedServices: [],
}

const userStore = create((set) => ({
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
          raisedIssues: [...state.auth.user.raisedIssues, issue],
        },
      },
    })),

  removeRaisedIssue: (issueId) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          raisedIssues: state.auth.user.raisedIssues.filter(
            (issue) => issue.id !== issueId
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
            ...state.auth.user.requestedServices,
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
          requestedServices: state.auth.user.requestedServices.filter(
            (service) => service.id !== serviceId
          ),
        },
      },
    })),
}))

export default userStore
