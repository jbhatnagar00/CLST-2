import React from 'react'
import { useNavigate } from 'react-router-dom'

const ClosetPage = () => {
  const navigate = useNavigate()
  
  React.useEffect(() => {
    document.title = 'My Closet - CLST'
  }, [])

  const handleAddItem = () => {
    // Navigate to the add item page
    navigate('/closet/add-item')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Closet</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Your digital wardrobe is empty. Start by adding your first item!
      </p>
      <button 
        onClick={handleAddItem}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Add Your First Item
      </button>
    </div>
  )
}

export default ClosetPage
