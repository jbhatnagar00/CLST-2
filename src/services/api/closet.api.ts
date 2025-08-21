// src/services/api/closet.api.ts
import { apiClient } from './AmplifyApiClient'

export const closetApi = {
  // Get all closet items for current user
  async getItems(params?: { page?: number; limit?: number; category?: string }) {
    return apiClient.get('/closet/items', params)
  },

  // Get single item by ID
  async getItem(id: string) {
    return apiClient.get(`/closet/items/${id}`)
  },

  // Create new closet item
  async createItem(data: {
    photoUrls: string[]
    brand: string
    itemName: string
    category: string
    size: string
    color: string
  }) {
    return apiClient.post('/closet/items', data)
  },

  // Update existing item
  async updateItem(id: string, data: any) {
    return apiClient.put(`/closet/items/${id}`, data)
  },

  // Delete item
  async deleteItem(id: string) {
    return apiClient.delete(`/closet/items/${id}`)
  },

  // Upload photos for closet items
  async uploadPhotos(photos: File[], userId: string) {
    const uploadedUrls: string[] = []
    
    for (const [index, photo] of photos.entries()) {
      const filename = `users/${userId}/closet/${Date.now()}-${index}-${photo.name}`
      
      // Upload using existing apiClient method
      const result = await apiClient.uploadFile(photo, filename)
      
      // Get the URL for the uploaded file
      const url = await apiClient.getFileUrl(result.key)
      uploadedUrls.push(url)
    }
    
    return uploadedUrls
  }
}
