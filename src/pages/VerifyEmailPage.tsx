import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { confirmSignUp, resendSignUpCode, autoSignIn } from 'aws-amplify/auth'

const VerifyEmailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    document.title = 'Verify Email - CLST'
    
    // Get email from navigation state or sessionStorage
    const emailFromState = location.state?.email
    const emailFromStorage = sessionStorage.getItem('pendingVerificationEmail')
    
    if (emailFromState) {
      setEmail(emailFromState)
    } else if (emailFromStorage) {
      setEmail(emailFromStorage)
    } else {
      // If no email found, redirect to register
      navigate('/auth/register')
    }
  }, [location, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (!code) {
      setError('Please enter the verification code')
      setIsLoading(false)
      return
    }

    if (!email) {
      setError('Email not found. Please sign up again.')
      setIsLoading(false)
      return
    }

    try {
      // Confirm the sign up with the verification code
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email.toLowerCase().trim(),
        confirmationCode: code.trim()
      })

      console.log('Confirmation result:', { isSignUpComplete, nextStep })

      if (isSignUpComplete) {
        setSuccess('Email verified successfully! Signing you in...')
        
        // Clear the stored email
        sessionStorage.removeItem('pendingVerificationEmail')
        
        // Try to auto sign in
        try {
          const signInResult = await autoSignIn()
          console.log('Auto sign in result:', signInResult)
          
          if (signInResult.isSignedIn) {
            // Navigate to closet after successful auto sign in
            setTimeout(() => {
              navigate('/closet')
            }, 1000)
          } else {
            // If auto sign in didn't work, redirect to login
            setTimeout(() => {
              navigate('/auth/login', { 
                state: { message: 'Email verified! Please log in.' } 
              })
            }, 1500)
          }
        } catch (autoSignInError) {
          console.log('Auto sign in failed, redirecting to login:', autoSignInError)
          // If auto sign in fails, redirect to login
          setTimeout(() => {
            navigate('/auth/login', { 
              state: { message: 'Email verified! Please log in.' } 
            })
          }, 1500)
        }
      } else {
        // Handle any additional steps if needed
        setError(`Additional step required: ${nextStep}`)
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      
      if (err.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please check and try again.')
      } else if (err.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.')
      } else if (err.name === 'NotAuthorizedException') {
        setError('This account has already been verified. Please log in.')
        setTimeout(() => navigate('/auth/login'), 2000)
      } else if (err.name === 'AliasExistsException') {
        setError('This email is already verified. Please log in.')
        setTimeout(() => navigate('/auth/login'), 2000)
      } else {
        setError(err.message || 'Verification failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found. Please sign up again.')
      return
    }

    setIsResending(true)
    setError('')
    setSuccess('')

    try {
      await resendSignUpCode({
        username: email.toLowerCase().trim()
      })
      
      setSuccess('Verification code resent! Check your email.')
    } catch (err: any) {
      console.error('Resend code error:', err)
      
      if (err.name === 'LimitExceededException') {
        setError('Too many attempts. Please wait a moment before trying again.')
      } else if (err.name === 'NotAuthorizedException') {
        setError('This account is already verified. Please log in.')
        setTimeout(() => navigate('/auth/login'), 2000)
      } else {
        setError(err.message || 'Failed to resend code. Please try again.')
      }
    } finally {
      setIsResending(false)
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
    boxSizing: 'border-box',
    textAlign: 'center',
    letterSpacing: '0.5rem'
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            ✉️
          </div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            Verify Your Email
          </h1>
          <p style={{
            color: '#666',
            fontSize: '0.875rem'
          }}>
            We've sent a verification code to<br />
            <strong>{email}</strong>
          </p>
        </div>

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

        {success && (
          <div style={{
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            color: '#060',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="code" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Enter Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="000000"
              maxLength={6}
              disabled={isLoading}
              autoComplete="one-time-code"
              autoFocus
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#666',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !code}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: isLoading || !code ? '#ccc' : 'black',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: isLoading || !code ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => !isLoading && code && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e5e5'
        }}>
          <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isResending}
            style={{
              background: 'none',
              border: 'none',
              color: isResending ? '#ccc' : 'black',
              textDecoration: 'underline',
              cursor: isResending ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              padding: 0
            }}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <Link
            to="/auth/register"
            style={{
              color: '#666',
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            ← Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
