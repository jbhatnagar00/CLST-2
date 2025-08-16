// Zustand store integrated with AWS Amplify Auth
import { create } from 'zustand'
import { Auth } from 'aws-amplify'

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  checkAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      set({
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          username: user.username,
          emailVerified: user.attributes.email_verified
        },
        isAuthenticated: true
      })
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const user = await Auth.signIn(email, password)
      set({
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          username: user.username
        },
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false
      })
      throw error
    }
  },

  signup: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName
        }
      })
      set({ isLoading: false })
    } catch (error: any) {
      set({
        error: error.message || 'Signup failed',
        isLoading: false
      })
      throw error
    }
  },

  logout: async () => {
    try {
      await Auth.signOut()
      set({
        user: null,
        isAuthenticated: false
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  clearError: () => set({ error: null })
}))
