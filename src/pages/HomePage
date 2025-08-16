import React from 'react'
import { Link } from 'react-router-dom'

// Feature card component with accessibility
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  link,
  color = '#000'
}: {
  title: string
  description: string
  icon: string
  link: string
  color?: string
}) => (
  <Link 
    to={link} 
    style={{ textDecoration: 'none', color: 'inherit' }}
    aria-label={`Go to ${title}`}
  >
    <article style={{ 
      padding: '2rem', 
      border: '2px solid black', 
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    onFocus={(e) => {
      e.currentTarget.style.outline = '3px solid black'
      e.currentTarget.style.outlineOffset = '2px'
    }}
    onBlur={(e) => {
      e.currentTarget.style.outline = 'none'
    }}
    >
      <div style={{ 
        fontSize: '3rem', 
        marginBottom: '1rem',
        color 
      }}
      role="img"
      aria-label={icon}
      >
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', flex: 1 }}>{description}</p>
    </article>
  </Link>
)

// Stats component
const Stats = () => (
  <section style={{
    padding: '4rem 2rem',
    backgroundColor: '#fafafa',
    textAlign: 'center'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem'
    }}>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>500K+</div>
        <div style={{ color: '#666' }}>Digital Closets</div>
      </div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>2M+</div>
        <div style={{ color: '#666' }}>Outfits Created</div>
      </div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>100K+</div>
        <div style={{ color: '#666' }}>Items Traded</div>
      </div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>4.9★</div>
        <div style={{ color: '#666' }}>User Rating</div>
      </div>
    </div>
  </section>
)

const HomePage = () => {
  React.useEffect(() => {
    document.title = 'CLST - Your Digital Fashion Closet'
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #fafafa, white)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            marginBottom: '1rem',
            lineHeight: 1.2 
          }}>
            Welcome to CLST
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
            color: '#666', 
            marginBottom: '3rem' 
          }}>
            Your Digital Fashion Closet
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/closet">
              <button style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Get Started
              </button>
            </Link>
            <button style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'black'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = 'black'
            }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '3rem' 
          }}>
            Everything You Need for Your Digital Wardrobe
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem'
          }}>
            <FeatureCard 
              title="Digital Closet" 
              description="Organize and manage your entire wardrobe digitally. Track wear counts, plan outfits, and never forget what you own."
              icon="👕"
              link="/closet"
              color="#2563eb"
            />
            <FeatureCard 
              title="Create Outfits" 
              description="Mix and match items to create perfect outfits. Plan your weekly wardrobe based on weather and occasions."
              icon="👗"
              link="/outfits"
              color="#dc2626"
            />
            <FeatureCard 
              title="Marketplace" 
              description="Buy and sell pre-loved fashion items. Give your clothes a second life and find unique pieces."
              icon="🛍️"
              link="/marketplace"
              color="#059669"
            />
            <FeatureCard 
              title="Fashion Trends" 
              description="Stay updated with the latest trends, seasonal colors, and style inspiration from around the world."
              icon="📈"
              link="/trends"
              color="#7c3aed"
            />
            <FeatureCard 
              title="Style Challenges" 
              description="Join weekly style challenges, share your outfits, and get inspired by the community."
              icon="🏆"
              link="/challenges"
              color="#ea580c"
            />
            <FeatureCard 
              title="Sustainability" 
              description="Track your fashion footprint, reduce waste, and make more conscious wardrobe decisions."
              icon="🌱"
              link="/sustainability"
              color="#059669"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Ready to Transform Your Wardrobe?
        </h2>
        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
          Join thousands of fashion-forward individuals managing their style digitally.
        </p>
        <Link to="/closet">
          <button style={{
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Free Today
          </button>
        </Link>
      </section>
    </>
  )
}

export default HomePage
