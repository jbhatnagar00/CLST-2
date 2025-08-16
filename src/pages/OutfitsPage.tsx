import React from 'react'

const OutfitsPage = () => {
  React.useEffect(() => {
    document.title = 'Outfits - CLST'
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Outfit Creator</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Create and save outfit combinations from your closet items.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div style={{
          padding: '2rem',
          border: '2px solid black',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3>Weekly Planner</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Plan outfits for the entire week based on weather and activities
          </p>
        </div>
        <div style={{
          padding: '2rem',
          border: '2px solid black',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3>Outfit Builder</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Mix and match items to create the perfect look
          </p>
        </div>
      </div>
    </div>
  )
}

export default OutfitsPage
