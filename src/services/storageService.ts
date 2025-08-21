// src/services/storageService.ts
import { uploadData, getUrl, remove, list } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';

export const storageService = {
  // Upload closet item photo (private to user)
  async uploadClosetPhoto(file: File, itemId: string) {
    const user = await getCurrentUser();
    const fileExtension = file.name.split('.').pop();
    const key = `users/${user.userId}/closet/${itemId}/${Date.now()}.${fileExtension}`;
    
    const result = await uploadData({
      path: key,
      data: file,
      options: {
        contentType: file.type,
      }
    }).result;
    
    return result.path;
  },

  // Get private closet photo URL
  async getClosetPhotoUrl(key: string) {
    const urlResult = await getUrl({
      path: key,
      options: {
        expiresIn: 3600 // 1 hour
      }
    });
    
    return urlResult.url.toString();
  },

  // Delete closet photo
  async deleteClosetPhoto(key: string) {
    await remove({
      path: key
    });
  },

  // List user's closet items
  async listUserClosetPhotos() {
    const user = await getCurrentUser();
    const result = await list({
      path: `users/${user.userId}/closet/`,
      options: {
        pageSize: 100
      }
    });
    
    return result.items;
  }
};
