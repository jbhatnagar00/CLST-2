import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './App'
import { fetchAuthSession } from 'aws-amplify/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuthState } = useAuth()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Double-check authentication status using fetchAuthSession instead of getCurrentUser
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Use fetchAuthSession which doesn't throw NotAuthorizedException
      const session = await fetchAuthSession()
      
      // Check if we have valid tokens
      if (session.tokens) {
        setIsAuthed(true)
      } else {
        console.log('No valid session in ProtectedRoute')
        setIsAuthed(false)
      }
    } catch (error) {
      console.log('Error checking auth in ProtectedRoute:', error)
      setIsAuthed(false)
    } finally {
      setIsChecking(false)
    }
  }

  // Show loading while checking
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <div>Checking authentication...</div>
      </div>
    )
  }

  // Use local auth check result, fallback to context
  if (!isAuthed && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
