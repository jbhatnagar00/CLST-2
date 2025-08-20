import React from 'react'
import { Link } from 'react-router-dom'

// Feature Card Component
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  link, 
  color 
}: { 
  title: string
  description: string
  icon: React.ReactNode
  link: string
  color: string
}) => (
  <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      cursor: 'pointer',
      border: '2px solid transparent',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
      e.currentTarget.style.borderColor = color
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.borderColor = 'transparent'
    }}>
      <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'center' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center' }}>{description}</p>
    </div>
  </Link>
)

const HomePage = () => {
  React.useEffect(() => {
    document.title = 'CLST - Your Digital Fashion Closet'
  }, [])

  return (
    <>
      <style>{`
        @keyframes smoothLoop {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .loop-container {
          width: 580px;
          height: 580px;
          position: relative;
          margin: 0 auto;
          margin-top: 6px;
        }
        
        .loop-text {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: smoothLoop 40s linear infinite;
          transform-origin: center;
        }
        
        .loop-text span {
          position: absolute;
          left: 50%;
          top: 0;
          transform-origin: 0 290px;
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ 
        padding: '4rem 0', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}>
        <div className="loop-container">
          <div className="loop-text">
            {[...Array(16)].map((_, i) => (
              <span
                key={i}
                style={{
                  transform: `rotate(${i * 22.5}deg)`,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: 1.2
                }}
              >
                Welcome To CLST&#8201;
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 2rem', marginTop: '175px' }}>
          <p style={{ 
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
            color: '#333', 
            marginBottom: '3rem' 
          }}>
            Your Closet's Digital Twin
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Link to="/auth/login">
              <button style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Log In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '4rem 2rem',
        backgroundColor: '#f5f5f5',
        paddingBottom: '6rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            marginBottom: '3rem' 
          }}>
            Everything You Need to Manage Your Style
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem',
            '@media (max-width: 1024px)': {
              gridTemplateColumns: 'repeat(3, 1fr)'
            },
            '@media (max-width: 768px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (max-width: 480px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            <FeatureCard 
              title="Digital Closet" 
              description="Organize your wardrobe digitally. Upload photos and categorize items."
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9C10.896 9 10 8.104 10 7C10 5.896 10.896 5 12 5C13.104 5 14 5.896 14 7C14 8.104 13.104 9 12 9Z" />
                  <path d="M12 9C12 9 4 11 4 14C4 15 6 16 6 16L18 16C18 16 20 15 20 14C20 11 12 9 12 9Z" />
                </svg>
              }
              link="/closet"
              color="#2563eb"
            />
            <FeatureCard 
              title="Outfit Planner" 
              description="Plan and create outfits based on the weather forecast."
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              }
              link="/outfits"
              color="#dc2626"
            />
            <FeatureCard 
              title="Marketplace" 
              description="Buy and sell pre-loved fashion items with the community."
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="7" width="14" height="14" rx="1" />
                  <path d="M9 7V5C9 3.895 9.895 3 11 3H13C14.105 3 15 3.895 15 5V7" />
                </svg>
              }
              link="/marketplace"
              color="#059669"
            />
            <FeatureCard 
              title="Fashion Trends" 
              description="Stay updated with the latest trends and style inspiration."
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              link="/trends"
              color="#7c3aed"
            />
            <FeatureCard 
              title="Style Challenges" 
              description="Join weekly challenges and get inspired by others."
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              }
              link="/challenges"
              color="#ea580c"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
