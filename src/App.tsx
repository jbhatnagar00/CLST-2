import React, { Suspense, lazy, createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

// TODO: Uncomment these imports when Amplify is configured
// import { Amplify } from 'aws-amplify'
// import { getCurrentUser, signOut } from 'aws-amplify/auth'
// import awsconfig from './aws-exports'

// TODO: Configure Amplify (uncomment when aws-exports.js is available)
// Amplify.configure(awsconfig)

// Lazy load components
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))

// Create Auth Context
interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  checkAuthState: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuthState: async () => {},
  logout: async () => {}
})

// Custom hook to use auth context
const useAuth = () => useContext(AuthContext)

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ClosetPage = lazy(() => import('./pages/ClosetPage'))
const OutfitsPage = lazy(() => import('./pages/OutfitsPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const TrendsPage = lazy(() => import('./pages/TrendsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))

// Loading component for Suspense fallback
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh' 
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p>Loading...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// Error Boundary for graceful error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2>Oops! Something went wrong</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Navigation component with active states
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const isHomePage = location.pathname === '/'

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // If user is not authenticated and on home page, redirect to login
    if (!isAuthenticated && isHomePage) {
      e.preventDefault()
      navigate('/auth/login')
    }
  }

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: 'black',
    borderBottom: isActive ? '2px solid black' : 'none',
    paddingBottom: '0.25rem',
    fontWeight: isActive ? 'bold' : 'normal'
  })

  return (
    <nav style={{ 
      borderBottom: '2px solid black',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 9999,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.125rem'
      }}>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textDecoration: 'none', 
          color: 'black',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            style={{ display: 'block' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </Link>
        
        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'center'
        }}
        className="desktop-nav"
        >
          <NavLink 
            to="/closet" 
            style={navLinkStyle}
            onClick={(e) => handleNavClick(e, '/closet')}
          >
            My Closet
          </NavLink>
          <NavLink 
            to="/outfits" 
            style={navLinkStyle}
            onClick={(e) => handleNavClick(e, '/outfits')}
          >
            Outfits
          </NavLink>
          <NavLink 
            to="/marketplace" 
            style={navLinkStyle}
            onClick={(e) => handleNavClick(e, '/marketplace')}
          >
            Marketplace
          </NavLink>
          <NavLink 
            to="/trends" 
            style={navLinkStyle}
            onClick={(e) => handleNavClick(e, '/trends')}
          >
            Trends
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '2px solid black',
          padding: '1rem',
          display: 'none'
        }}
        className="mobile-nav"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NavLink 
              to="/closet" 
              style={navLinkStyle} 
              onClick={(e) => {
                handleNavClick(e, '/closet')
                if (isAuthenticated || !isHomePage) setIsMobileMenuOpen(false)
              }}
            >
              My Closet
            </NavLink>
            <NavLink 
              to="/outfits" 
              style={navLinkStyle} 
              onClick={(e) => {
                handleNavClick(e, '/outfits')
                if (isAuthenticated || !isHomePage) setIsMobileMenuOpen(false)
              }}
            >
              Outfits
            </NavLink>
            <NavLink 
              to="/marketplace" 
              style={navLinkStyle} 
              onClick={(e) => {
                handleNavClick(e, '/marketplace')
                if (isAuthenticated || !isHomePage) setIsMobileMenuOpen(false)
              }}
            >
              Marketplace
            </NavLink>
            <NavLink 
              to="/trends" 
              style={navLinkStyle} 
              onClick={(e) => {
                handleNavClick(e, '/trends')
                if (isAuthenticated || !isHomePage) setIsMobileMenuOpen(false)
              }}
            >
              Trends
            </NavLink>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

// Footer component - Simplified to just copyright
const Footer = () => (
  <footer style={{
    marginTop: 'auto',
    backgroundColor: '#f5f5f5',
    width: '100%',
    boxSizing: 'border-box'
  }}>
    <div style={{
      height: '2px',
      backgroundColor: 'black',
      width: '100%'
    }} />
    <div style={{
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'black',
      fontSize: '1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div>© 2025 CLST</div>
      <div>J.B Goods™</div>
    </div>
  </footer>
)

// Main App component with performance optimizations
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Add global styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      * {
        box-sizing: border-box;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Check authentication state on app load
  const checkAuthState = async () => {
    try {
      // TODO: Replace with Amplify Auth when configured
      // const user = await getCurrentUser()
      // setIsAuthenticated(true)
      
      // For now, check localStorage (temporary solution)
      const authToken = localStorage.getItem('authToken')
      setIsAuthenticated(!!authToken)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // TODO: Replace with Amplify Auth when configured
      // await signOut()
      
      // For now, clear localStorage
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  // Show loading while checking auth
  if (isCheckingAuth) {
    return <PageLoader />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuthState, logout }}>
      <ErrorBoundary>
        <Router>
          <div style={{ 
            minHeight: '100vh', 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0,
            width: '100%',
            overflowX: 'hidden',
            position: 'relative'
          }}>
            <Navigation />
            <main style={{ 
              flex: 1,
              backgroundColor: '#f5f5f5',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/closet" element={
                    <ProtectedRoute>
                      <ClosetPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/outfits" element={
                    <ProtectedRoute>
                      <OutfitsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/marketplace" element={
                    <ProtectedRoute>
                      <MarketplacePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/trends" element={
                    <ProtectedRoute>
                      <TrendsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthContext.Provider>
  )
}

export default App
export { AuthContext, useAuth }
