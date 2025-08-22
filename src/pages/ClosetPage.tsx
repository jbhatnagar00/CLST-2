import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'

const ClosetPage = () => {
  const { logout } = useAuth()
  
  React.useEffect(() => {
    document.title = 'My Closet - CLST'
    console.log('📦 ClosetPage mounted')
  }, [])

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>
          My Closet
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            to="/closet/add-item"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              display: 'inline-block'
            }}
          >
            + Add Item
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Welcome to your digital closet!
        </p>
        <p style={{ color: '#999' }}>
          Your closet is empty. Start by adding your first item.
        </p>
        <Link
          to="/closet/add-item"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'black',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem'
          }}
        >
          Add Your First Item
        </Link>
      </div>
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '0.25rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
          Debug Info: You are successfully authenticated and viewing the closet page.
        </p>
      </div>
    </div>
  )
}

export default ClosetPage
