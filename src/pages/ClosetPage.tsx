import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { closetService } from '../services/closetService'

interface ClosetItem {
  id: string
  photos: File[]
  brand: string
  itemName: string
  category: string
  size: string
  color: string
  addedDate: string
}

const ClosetPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<ClosetItem[]>([])
  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({})
  
  React.useEffect(() => {
    document.title = 'My Closet - CLST'
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      // Load items from Amplify backend
      const items = await closetService.getUserItems()
      setItems(items)
      
      // Photo URLs are already included from the service
      const urls: Record<string, string[]> = {}
      items.forEach((item: any) => {
        if (item.photoUrls) {
          urls[item.id] = item.photoUrls
        }
      })
      setPhotoUrls(urls)
    } catch (error) {
      console.error('Error loading items:', error)
      // Fallback to localStorage if needed
      const savedItems = JSON.parse(localStorage.getItem('closetItems') || '[]')
      setItems(savedItems)
    }
  }

  const handleAddItem = () => {
    navigate('/closet/add-item')
  }

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?')
    if (confirmed) {
      try {
        await closetService.deleteItem(itemId)
        // Reload items after deletion
        await loadItems()
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Failed to delete item. Please try again.')
      }
    }
  }

  if (items.length === 0) {
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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <h1>My Closet ({items.length} items)</h1>
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
          Add New Item
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {items.map((item) => (
          <div 
            key={item.id}
            style={{
              backgroundColor: 'white',
              border: '2px solid black',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}
          >
            {/* Photo placeholder */}
            <div style={{
              height: '300px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#ddd'
            }}>
              📷
            </div>

            {/* Item details */}
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>
                {item.brand} - {item.itemName}
              </h3>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>
                Category: {item.category}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>
                Size: {item.size}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.875rem' }}>
                Color: {item.color}
              </p>
              
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#dc2626'
                }}
              >
                Delete Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClosetPage
