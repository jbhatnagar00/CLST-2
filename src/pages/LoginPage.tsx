import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import { signIn } from 'aws-amplify/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsAuthenticated, checkAuthState } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    document.title = 'Log In - CLST'
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      // Use Amplify Auth to sign in
      const { isSignedIn, nextStep } = await signIn({ 
        username: email, 
        password 
      })
      
      console.log('Sign in result:', { isSignedIn, nextStep })
      
      if (isSignedIn) {
        // Update auth state
        setIsAuthenticated(true)
        
        // Double-check auth state
        await checkAuthState()
        
        // Navigate to originally requested page or closet
        const from = location.state?.from?.pathname || '/closet'
        navigate(from, { replace: true })
      } else {
        // Handle additional steps if needed (e.g., MFA, new password required)
        if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          setError('Please verify your email before signing in')
        } else if (nextStep.signInStep === 'NEW_PASSWORD_REQUIRED') {
          setError('You need to set a new password')
          // You might want to navigate to a new password page
        } else {
          setError(`Additional step required: ${nextStep.signInStep}`)
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error cases
      if (err.name === 'UserNotFoundException') {
        setError('No account found with this email')
      } else if (err.name === 'NotAuthorizedException') {
        setError('Incorrect email or password')
      } else if (err.name === 'UserNotConfirmedException') {
        setError('Please verify your email before signing in')
      } else {
        setError(err.message || 'An error occurred during sign in')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #e5e5e5',
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Welcome Back
        </h1>
        <p style={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Log in to access your digital closet
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c00',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: isLoading ? '#ccc' : 'black',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <Link
              to="/auth/forgot-password"
              style={{
                color: '#666',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e5e5'
        }}>
          <span style={{ color: '#666' }}>
            Don't have an account?{' '}
          </span>
          <Link
            to="/auth/register"
            style={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
