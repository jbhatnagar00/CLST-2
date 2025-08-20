import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ItemData {
  photos: File[]
  brand: string
  itemName: string
  category: string
  size: string
  color: string
}

const AddItemPage = () => {
  const navigate = useNavigate()
  const [itemData, setItemData] = useState<ItemData>({
    photos: [],
    brand: '',
    itemName: '',
    category: '',
    size: '',
    color: ''
  })
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  React.useEffect(() => {
    document.title = 'Add Item - CLST'
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const newPhotos = [...itemData.photos, ...fileArray].slice(0, 5) // Max 5 photos
      
      // Create preview URLs
      const newUrls = newPhotos.map(file => URL.createObjectURL(file))
      setPhotoUrls(newUrls)
      
      setItemData({ ...itemData, photos: newPhotos })
      
      // Clear photo error if we now have at least 2
      if (newPhotos.length >= 2 && errors.photos) {
        setErrors({ ...errors, photos: '' })
      }
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = itemData.photos.filter((_, i) => i !== index)
    const newUrls = photoUrls.filter((_, i) => i !== index)
    setItemData({ ...itemData, photos: newPhotos })
    setPhotoUrls(newUrls)
  }

  const handleInputChange = (field: keyof ItemData, value: string) => {
    setItemData({ ...itemData, [field]: value })
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (itemData.photos.length < 2) {
      newErrors.photos = 'Please add at least 2 photos'
    }
    if (!itemData.brand.trim()) {
      newErrors.brand = 'Brand is required'
    }
    if (!itemData.itemName.trim()) {
      newErrors.itemName = 'Item name is required'
    }
    if (!itemData.category) {
      newErrors.category = 'Category is required'
    }
    if (!itemData.size.trim()) {
      newErrors.size = 'Size is required'
    }
    if (!itemData.color.trim()) {
      newErrors.color = 'Color is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // TODO: Submit to API
      console.log('Submitting item:', itemData)
      alert('Item added successfully!')
      // Navigate back to closet page
      navigate('/closet')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '0.25rem',
    marginTop: '0.25rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '1rem',
    fontWeight: '500'
  }

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Add New Item</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <label style={labelStyle}>
          Photos (minimum 2 required)
          <div style={{ 
            marginTop: '0.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {photoUrls.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={url} 
                  alt={`Item ${index + 1}`}
                  style={{ 
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '0.25rem',
                    border: '2px solid #ddd'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            {itemData.photos.length < 5 && (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '120px',
                border: '2px dashed #ddd',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                backgroundColor: '#f9fafb'
              }}>
                <span style={{ fontSize: '2rem' }}>📷</span>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          {errors.photos && <div style={errorStyle}>{errors.photos}</div>}
        </label>

        {/* Brand */}
        <label style={labelStyle}>
          Brand
          <input
            type="text"
            value={itemData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            style={inputStyle}
            placeholder="e.g., Nike, Zara, H&M"
          />
          {errors.brand && <div style={errorStyle}>{errors.brand}</div>}
        </label>

        {/* Item Name */}
        <label style={labelStyle}>
          Item Name
          <input
            type="text"
            value={itemData.itemName}
            onChange={(e) => handleInputChange('itemName', e.target.value)}
            style={inputStyle}
            placeholder="e.g., Classic White T-Shirt"
          />
          {errors.itemName && <div style={errorStyle}>{errors.itemName}</div>}
        </label>

        {/* Category */}
        <label style={labelStyle}>
          Category
          <select
            value={itemData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select a category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="outerwear">Outerwear</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
          {errors.category && <div style={errorStyle}>{errors.category}</div>}
        </label>

        {/* Size */}
        <label style={labelStyle}>
          Size
          <input
            type="text"
            value={itemData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            style={inputStyle}
            placeholder="e.g., M, L, 9, 32"
          />
          {errors.size && <div style={errorStyle}>{errors.size}</div>}
        </label>

        {/* Color */}
        <label style={labelStyle}>
          Color
          <input
            type="text"
            value={itemData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            style={inputStyle}
            placeholder="e.g., Black, Navy Blue, White"
          />
          {errors.color && <div style={errorStyle}>{errors.color}</div>}
        </label>

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem' 
        }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={() => navigate('/closet')}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemPage
