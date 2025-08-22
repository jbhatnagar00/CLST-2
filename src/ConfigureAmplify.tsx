import React, { useEffect, useState, createContext, useContext } from 'react'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json' // Path from src/ to root

// Type definitions for Amplify outputs
interface AmplifyOutputs {
  version: string
  auth?: {
    user_pool_id: string
    user_pool_client_id: string
    identity_pool_id?: string
    aws_region: string
    password_policy?: {
      min_length?: number
      require_numbers?: boolean
      require_lowercase?: boolean
      require_uppercase?: boolean
      require_symbols?: boolean
    }
    oauth?: {
      domain: string
      scope: string[]
      redirect_sign_in_uri: string[]
      redirect_sign_out_uri: string[]
      response_type: string
      identity_providers?: string[]
    }
    standard_required_attributes?: string[]
    username_attributes?: string[]
    user_verification_types?: string[]
    unauthenticated_identities_enabled?: boolean
    mfa_configuration?: string
    mfa_methods?: string[]
  }
  storage?: {
    bucket_name: string
    aws_region: string
  }
  data?: {
    url: string
    aws_region: string
    api_key?: string
    default_authorization_type: string
    authorization_types?: string[]
  }
  analytics?: {
    amazon_pinpoint?: {
      app_id: string
      aws_region: string
    }
  }
  geo?: {
    aws_region: string
    maps?: {
      items: Record<string, {
        style: string
      }>
      default: string
    }
    search_indices?: {
      items: string[]
      default: string
    }
    geofence_collections?: {
      items: string[]
      default: string
    }
  }
  notifications?: {
    amazon_pinpoint_app_id?: string
    aws_region: string
    channels?: string[]
  }
  custom?: Record<string, any>
}

// Configuration status interface
interface ConfigurationStatus {
  isConfigured: boolean
  isLoading: boolean
  error: string | null
  services: {
    auth: boolean
    storage: boolean
    api: boolean
    analytics: boolean
    geo: boolean
    notifications: boolean
  }
  config: AmplifyOutputs | null
}

// Context for sharing configuration status
const AmplifyConfigContext = createContext<ConfigurationStatus>({
  isConfigured: false,
  isLoading: true,
  error: null,
  services: {
    auth: false,
    storage: false,
    api: false,
    analytics: false,
    geo: false,
    notifications: false
  },
  config: null
})

interface ConfigureAmplifyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onConfigured?: () => void
  onError?: (error: string) => void
  showDebugInfo?: boolean
  blockRoutes?: boolean // New prop to control route blocking
  loadingComponent?: React.ReactNode // Custom loading component
}

const ConfigureAmplify: React.FC<ConfigureAmplifyProps> = ({ 
  children, 
  fallback,
  onConfigured,
  onError,
  showDebugInfo = process.env.NODE_ENV === 'development',
  blockRoutes = true,
  loadingComponent
}) => {
  const [status, setStatus] = useState<ConfigurationStatus>({
    isConfigured: false,
    isLoading: true,
    error: null,
    services: {
      auth: false,
      storage: false,
      api: false,
      analytics: false,
      geo: false,
      notifications: false
    },
    config: null
  })

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        // Validate outputs structure
        if (!outputs || typeof outputs !== 'object') {
          throw new Error('Invalid amplify_outputs.json: File is missing or malformed')
        }

        if (!outputs.version) {
          throw new Error('Invalid amplify_outputs.json: Missing version field')
        }

        // Configure Amplify with the outputs
        Amplify.configure(outputs)
        
        // Determine which services are configured
        const services = {
          auth: !!outputs.auth?.user_pool_id,
          storage: !!outputs.storage?.bucket_name,
          api: !!outputs.data?.url,
          analytics: !!outputs.analytics?.amazon_pinpoint,
          geo: !!outputs.geo,
          notifications: !!outputs.notifications
        }

        // Log configuration details in development
        if (showDebugInfo) {
          console.group('✅ Amplify Configuration')
          console.log('Version:', outputs.version)
          
          if (outputs.auth) {
            console.group('Auth Configuration:')
            console.log('Region:', outputs.auth.aws_region)
            console.log('User Pool ID:', outputs.auth.user_pool_id)
            console.log('Client ID:', outputs.auth.user_pool_client_id)
            console.log('Identity Pool:', outputs.auth.identity_pool_id || 'Not configured')
            console.log('OAuth:', outputs.auth.oauth ? 'Configured' : 'Not configured')
            console.log('MFA:', outputs.auth.mfa_configuration || 'Not configured')
            console.groupEnd()
          }
          
          if (outputs.storage) {
            console.group('Storage Configuration:')
            console.log('Bucket:', outputs.storage.bucket_name)
            console.log('Region:', outputs.storage.aws_region)
            console.groupEnd()
          }
          
          if (outputs.data) {
            console.group('API Configuration:')
            console.log('Endpoint:', outputs.data.url)
            console.log('Region:', outputs.data.aws_region)
            console.log('Auth Type:', outputs.data.default_authorization_type)
            console.groupEnd()
          }

          console.log('Services Status:', services)
          console.groupEnd()
        }
        
        setStatus({
          isConfigured: true,
          isLoading: false,
          error: null,
          services,
          config: outputs as AmplifyOutputs
        })

        // Call success callback
        onConfigured?.()
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to configure Amplify'
        
        console.error('❌ Amplify Configuration Error:', err)
        
        setStatus({
          isConfigured: false,
          isLoading: false,
          error: errorMessage,
          services: {
            auth: false,
            storage: false,
            api: false,
            analytics: false,
            geo: false,
            notifications: false
          },
          config: null
        })

        // Call error callback
        onError?.(errorMessage)
      }
    }

    configureAmplify()
  }, [onConfigured, onError, showDebugInfo])

  // Custom loading component
  const LoadingComponent = loadingComponent || fallback || (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ marginTop: '1rem', color: '#666' }}>
        Initializing AWS Services...
      </div>
    </div>
  )

  // Error display component
  if (status.error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h2 style={{ 
            color: '#dc3545',
            marginTop: 0,
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            ⚠️ Configuration Error
          </h2>
          
          <p style={{ 
            color: '#6c757d',
            marginBottom: '1.5rem'
          }}>
            {status.error}
          </p>

          {showDebugInfo && (
            <>
              <details style={{ marginBottom: '1.5rem' }}>
                <summary style={{ 
                  cursor: 'pointer',
                  color: '#007bff',
                  marginBottom: '0.5rem'
                }}>
                  View Configuration Details
                </summary>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  maxHeight: '400px',
                  border: '1px solid #dee2e6'
                }}>
                  {JSON.stringify(outputs, null, 2)}
                </pre>
              </details>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.25rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  marginTop: 0,
                  marginBottom: '0.5rem'
                }}>
                  Troubleshooting Steps:
                </h3>
                <ol style={{ 
                  marginBottom: 0,
                  paddingLeft: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#6c757d'
                }}>
                  <li>Ensure amplify_outputs.json exists in the src directory</li>
                  <li>Verify the file contains valid JSON</li>
                  <li>Check that you have run `amplify pull` or `amplify push`</li>
                  <li>Confirm your AWS credentials are configured correctly</li>
                </ol>
              </div>
            </>
          )}

          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff'
            }}
          >
            Retry Configuration
          </button>
        </div>
      </div>
    )
  }

  // Show loading while configuring
  if (status.isLoading) {
    return LoadingComponent as React.ReactElement
  }

  // Provide configuration status to children via context
  // Only render children after successful configuration (if blockRoutes is true)
  return (
    <AmplifyConfigContext.Provider value={status}>
      {blockRoutes && !status.isConfigured ? null : children}
    </AmplifyConfigContext.Provider>
  )
}

// Hook to access Amplify configuration status
export const useAmplifyConfig = () => {
  const context = useContext(AmplifyConfigContext)
  if (!context) {
    throw new Error('useAmplifyConfig must be used within ConfigureAmplify')
  }
  return context
}

// HOC to ensure a component only renders when a specific service is configured
export const withAmplifyService = <P extends object>(
  Component: React.ComponentType<P>,
  requiredService: keyof ConfigurationStatus['services']
): React.FC<P> => {
  return (props: P) => {
    const { services, isConfigured } = useAmplifyConfig()
    
    if (!isConfigured || !services[requiredService]) {
      return (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '0.25rem',
          color: '#856404'
        }}>
          ⚠️ {requiredService.charAt(0).toUpperCase() + requiredService.slice(1)} service is not configured
        </div>
      )
    }
    
    return <Component {...props} />
  }
}

// Helper function to check if a specific service is available
export const isServiceAvailable = (service: keyof ConfigurationStatus['services']): boolean => {
  if (typeof window !== 'undefined' && (window as any).__AMPLIFY_CONFIG__) {
    return (window as any).__AMPLIFY_CONFIG__.services[service] || false
  }
  return false
}

// Store configuration globally for access outside React
if (typeof window !== 'undefined') {
  (window as any).__AMPLIFY_CONFIG__ = {
    services: {
      auth: false,
      storage: false,
      api: false,
      analytics: false,
      geo: false,
      notifications: false
    },
    isReady: false // Add global ready flag
  }
}

// Route Guard Component - ensures Amplify is configured before rendering routes
export const AmplifyRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured, isLoading, error, services } = useAmplifyConfig()
  
  // Specifically check for Auth service if your app requires it
  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <h2>Configuration Error</h2>
        <p>Unable to initialize AWS services.</p>
        <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          {error.includes('UserPool') ? 'Authentication service not configured properly.' : error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }
  
  if (isLoading || !isConfigured) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '1rem' }}>Initializing AWS services...</div>
        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          Configuring authentication...
        </div>
      </div>
    )
  }
  
  // Extra safety check for Auth service
  if (!services.auth) {
    console.warn('⚠️ Auth service not available. UserPool may not be configured.')
  }
  
  return <>{children}</>
}

// Async boundary component for Suspense integration
export const AmplifyAsyncBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured } = useAmplifyConfig()
  
  if (!isConfigured) {
    throw new Promise(() => {}) // This will trigger Suspense
  }
  
  return <>{children}</>
}

// Safe Auth check hook - use this before any Auth operations
export const useAmplifyAuth = () => {
  const { services, isConfigured } = useAmplifyConfig()
  
  return {
    isAuthReady: isConfigured && services.auth,
    canUseAuth: () => {
      if (!isConfigured) {
        console.error('❌ Amplify not configured yet')
        return false
      }
      if (!services.auth) {
        console.error('❌ Auth service not configured')
        return false
      }
      return true
    }
  }
}

export default ConfigureAmplify

// Example usage with React Router to ensure proper initialization order:
/*
// App.tsx - PREVENTS UserPool errors
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ConfigureAmplify from './ConfigureAmplify'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ConfigureAmplify 
      blockRoutes={true} // CRITICAL: Blocks all children until Amplify is ready
      onConfigured={() => console.log('Amplify is ready!')}
      onError={(error) => {
        if (error.includes('UserPool')) {
          console.error('UserPool configuration failed:', error)
        }
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigureAmplify>
  )
}

// AuthProvider.tsx - SAFE Auth usage
import { useEffect } from 'react'
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { useAmplifyAuth } from './ConfigureAmplify'

function AuthProvider({ children }) {
  const { isAuthReady, canUseAuth } = useAmplifyAuth()
  
  useEffect(() => {
    // Only attempt Auth operations when ready
    if (isAuthReady) {
      checkCurrentUser()
    }
  }, [isAuthReady])
  
  const checkCurrentUser = async () => {
    if (!canUseAuth()) {
      console.log('Auth not ready, skipping user check')
      return
    }
    
    try {
      const user = await getCurrentUser()
      console.log('Current user:', user)
    } catch (error) {
      console.log('No current user')
    }
  }
  
  const login = async (username: string, password: string) => {
    if (!canUseAuth()) {
      throw new Error('Authentication service not ready')
    }
    
    // Safe to use Auth now
    return await signIn({ username, password })
  }
  
  return <>{children}</>
}

// ProtectedRoute.tsx - Route-level Auth protection
import { Navigate } from 'react-router-dom'
import { useAmplifyAuth } from './ConfigureAmplify'

function ProtectedRoute({ children }) {
  const { isAuthReady } = useAmplifyAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (isAuthReady) {
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }
  }, [isAuthReady])
  
  // Don't even check auth until Amplify is ready
  if (!isAuthReady || loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}
*/
