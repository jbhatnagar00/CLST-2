import React from 'react'

const TrendsPage = () => {
  React.useEffect(() => {
    document.title = 'Fashion Trends - CLST'
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Fashion Trends</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Discover the latest fashion trends and style inspiration.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <article style={{
          border: '2px solid black',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>🎨</span>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Colors of the Season</h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Discover the trending colors for this season and how to incorporate them into your wardrobe.
            </p>
          </div>
        </article>
        
        <article style={{
          border: '2px solid black',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>✨</span>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Street Style Inspiration</h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Get inspired by street style looks from fashion capitals around the world.
            </p>
          </div>
        </article>
        
        <article style={{
          border: '2px solid black',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>🌿</span>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Sustainable Fashion</h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Learn about eco-friendly brands and sustainable fashion practices.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}

export default TrendsPage
