// Zustand store integrated with AWS Amplify Auth v6
import { create } from 'zustand'
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

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
      const { username, userId } = await getCurrentUser()
      const session = await fetchAuthSession()
      
      set({
        user: {
          id: userId,
          email: session.tokens?.idToken?.payload?.email as string || '',
          username: username,
          emailVerified: true
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
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password
      })
      
      if (isSignedIn) {
        const { username, userId } = await getCurrentUser()
        const session = await fetchAuthSession()
        
        set({
          user: {
            id: userId,
            email: email,
            username: username
          },
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        // Handle additional steps if needed (MFA, etc.)
        set({
          error: `Additional step required: ${nextStep.signInStep}`,
          isLoading: false
        })
      }
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
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName
          }
        }
      })
      
      if (isSignUpComplete) {
        set({ isLoading: false })
      } else {
        // Handle confirmation step
        set({ 
          isLoading: false,
          error: `Please confirm your account. Check your email for the verification code.`
        })
      }
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
      await signOut()
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
