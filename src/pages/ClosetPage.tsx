import React from 'react'

const ClosetPage = () => {
  React.useEffect(() => {
    document.title = 'My Closet - CLST'
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Closet</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Your digital wardrobe is empty. Start by adding your first item!
      </p>
      <button style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer'
      }}>
        Add Your First Item
      </button>
    </div>
  )
}

export default ClosetPage
