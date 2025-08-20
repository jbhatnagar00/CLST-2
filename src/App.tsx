import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ClosetPage = lazy(() => import('./pages/ClosetPage'))
const OutfitsPage = lazy(() => import('./pages/OutfitsPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const TrendsPage = lazy(() => import('./pages/TrendsPage'))

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

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: 'black',
    borderBottom: isActive ? '2px solid black' : 'none',
    paddingBottom: '0.25rem',
    fontWeight: isActive ? 'bold' : 'normal'
  })

  return (
    <nav style={{ 
      padding: '1rem', 
      borderBottom: '2px solid black',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textDecoration: 'none', 
          color: 'black' 
        }}>
          CLST
        </Link>
        
        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'center'
        }}
        className="desktop-nav"
        >
          <NavLink to="/closet" style={navLinkStyle}>My Closet</NavLink>
          <NavLink to="/outfits" style={navLinkStyle}>Outfits</NavLink>
          <NavLink to="/marketplace" style={navLinkStyle}>Marketplace</NavLink>
          <NavLink to="/trends" style={navLinkStyle}>Trends</NavLink>
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
            <NavLink to="/closet" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              My Closet
            </NavLink>
            <NavLink to="/outfits" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              Outfits
            </NavLink>
            <NavLink to="/marketplace" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              Marketplace
            </NavLink>
            <NavLink to="/trends" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
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
    marginTop: 'auto'
  }}>
    <div style={{
      height: '2px',
      backgroundColor: 'black'
    }} />
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      color: '#666',
      fontSize: '0.875rem'
    }}>
      © 2025 CLST. All rights reserved.
    </div>
  </footer>
)

// Main App component with performance optimizations
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ 
          minHeight: '100vh', 
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navigation />
          <main style={{ flex: 1 }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/closet" element={<ClosetPage />} />
                <Route path="/outfits" element={<OutfitsPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/trends" element={<TrendsPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
