import React from 'react'

const MarketplacePage = () => {
  React.useEffect(() => {
    document.title = 'Marketplace - CLST'
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Fashion Marketplace</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Buy and sell pre-loved fashion items in our sustainable marketplace.
      </p>
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          All Items
        </button>
        <button style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          color: 'black',
          border: '2px solid black',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Women
        </button>
        <button style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          color: 'black',
          border: '2px solid black',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Men
        </button>
        <button style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          color: 'black',
          border: '2px solid black',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Accessories
        </button>
      </div>
      <p style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
        No items available yet. Check back soon!
      </p>
    </div>
  )
}

export default MarketplacePage
