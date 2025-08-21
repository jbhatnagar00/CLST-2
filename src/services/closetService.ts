// src/services/closetService.ts
import { closetApi } from './api/closet.api'
import { apiClient } from './api/AmplifyApiClient'

interface AddItemData {
  photos: File[]
  brand: string
  itemName: string
  category: string
  size: string
  color: string
}

export const closetService = {
  // Add new item with photo upload
  async addItem(data: AddItemData) {
    try {
      // Get current user using existing apiClient
      const user = await apiClient.getCurrentUser()
      
      // Upload photos first
      const photoUrls = await closetApi.uploadPhotos(data.photos, user.id)
      
      // Create item with photo URLs
      const newItem = await closetApi.createItem({
        photoUrls,
        brand: data.brand,
        itemName: data.itemName,
        category: data.category,
        size: data.size,
        color: data.color
      })
      
      return newItem
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  },

  // Get all user's items
  async getUserItems(params?: { page?: number; category?: string }) {
    try {
      const items = await closetApi.getItems(params)
      return items
    } catch (error) {
      console.error('Error fetching items:', error)
      throw error
    }
  },

  // Delete item
  async deleteItem(itemId: string) {
    try {
      await closetApi.deleteItem(itemId)
      return true
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  },

  // Update item details (without changing photos)
  async updateItem(itemId: string, updates: Partial<Omit<AddItemData, 'photos'>>) {
    try {
      const updatedItem = await closetApi.updateItem(itemId, updates)
      return updatedItem
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }
}
