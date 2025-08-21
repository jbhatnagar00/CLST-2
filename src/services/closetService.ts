// src/services/closetService.ts
import { generateClient } from 'aws-amplify/data';
import { storageService } from './storageService';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface AddItemData {
  photos: File[]
  brand: string
  itemName: string
  category: string
  size: string
  color: string
}

export const closetService = {
  async addItem(data: AddItemData) {
    try {
      const user = await getCurrentUser();
      
      // Generate a temporary item ID for photo organization
      const tempItemId = Date.now().toString();
      
      // Upload photos first
      const photoKeys: string[] = [];
      for (const photo of data.photos) {
        const key = await storageService.uploadClosetPhoto(photo, tempItemId);
        photoKeys.push(key);
      }
      
      // Create item in database
      const { data: newItem, errors } = await client.models.ClosetItem.create({
        brand: data.brand,
        itemName: data.itemName,
        category: data.category,
        size: data.size,
        color: data.color,
        photoKeys: photoKeys,
        userId: user.userId
      });
      
      if (errors) {
        console.error('Error creating item:', errors);
        throw new Error('Failed to create item');
      }
      
      return newItem;
    } catch (error) {
      console.error('Error in addItem:', error);
      throw error;
    }
  },
  
  async getUserItems() {
    try {
      const { data: items, errors } = await client.models.ClosetItem.list();
      
      if (errors) {
        console.error('Error fetching items:', errors);
        return [];
      }
      
      // Get photo URLs for each item
      const itemsWithPhotos = await Promise.all(
        items.map(async (item) => {
          const photoUrls = await Promise.all(
            (item.photoKeys || []).map(key => storageService.getClosetPhotoUrl(key))
          );
          return {
            ...item,
            photoUrls
          };
        })
      );
      
      return itemsWithPhotos;
    } catch (error) {
      console.error('Error in getUserItems:', error);
      return [];
    }
  },
  
  async deleteItem(itemId: string) {
    try {
      // Get item to find photo keys
      const { data: item } = await client.models.ClosetItem.get({ id: itemId });
      
      if (item) {
        // Delete photos from storage
        await Promise.all(
          (item.photoKeys || []).map(key => storageService.deleteClosetPhoto(key))
        );
        
        // Delete item from database
        const { errors } = await client.models.ClosetItem.delete({ id: itemId });
        
        if (errors) {
          console.error('Error deleting item:', errors);
          throw new Error('Failed to delete item');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteItem:', error);
      throw error;
    }
  }
};
