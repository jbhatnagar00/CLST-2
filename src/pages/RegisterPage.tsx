import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from 'aws-amplify/auth'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  React.useEffect(() => {
    document.title = 'Sign Up - CLST'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validatePassword = (password: string): string | null => {
    // Match Cognito requirements from amplify_outputs.json
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return 'Password must contain at least one special character'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Validate password against Cognito requirements
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Sign up with Cognito
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: formData.email.toLowerCase().trim(), // Use email as username
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email.toLowerCase().trim(),
            name: formData.name.trim()
          },
          autoSignIn: true // Will auto sign in after confirmation
        }
      })

      console.log('Sign up result:', { isSignUpComplete, userId, nextStep })

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // User needs to verify email
        setNeedsVerification(true)
        // Store email in sessionStorage for the verification page
        sessionStorage.setItem('pendingVerificationEmail', formData.email)
        // Navigate to verification page
        navigate('/auth/verify-email', { 
          state: { email: formData.email } 
        })
      } else if (isSignUpComplete) {
        // Rare case where no verification is needed
        navigate('/auth/login')
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      
      if (err.name === 'UsernameExistsException') {
        setError('An account with this email already exists')
      } else if (err.name === 'InvalidPasswordException') {
        setError(err.message || 'Password does not meet requirements')
      } else if (err.name === 'InvalidParameterException') {
        if (err.message.includes('email')) {
          setError('Please enter a valid email address')
        } else {
          setError(err.message || 'Invalid input provided')
        }
      } else {
        setError(err.message || 'An error occurred during sign up')
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
          Create Account
        </h1>
        <p style={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Join CLST to start organizing your digital closet
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
            <label htmlFor="name" style={labelStyle}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="Jane Doe"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <div style={{
              fontSize: '0.75rem',
              color: '#666',
              marginTop: '0.25rem'
            }}>
              <div>Password must contain:</div>
              <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0 }}>
                <li style={{ color: formData.password.length >= 8 ? 'green' : '#666' }}>
                  At least 8 characters
                </li>
                <li style={{ color: /[a-z]/.test(formData.password) ? 'green' : '#666' }}>
                  One lowercase letter
                </li>
                <li style={{ color: /[A-Z]/.test(formData.password) ? 'green' : '#666' }}>
                  One uppercase letter
                </li>
                <li style={{ color: /[0-9]/.test(formData.password) ? 'green' : '#666' }}>
                  One number
                </li>
                <li style={{ color: /[^a-zA-Z0-9]/.test(formData.password) ? 'green' : '#666' }}>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
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
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e5e5'
        }}>
          <span style={{ color: '#666' }}>
            Already have an account?{' '}
          </span>
          <Link
            to="/auth/login"
            style={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
