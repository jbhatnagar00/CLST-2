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
      key,
      data: file,
      options: {
        contentType: file.type,
        // No need to specify accessLevel - path determines access
      }
    }).result;
    
    return result.key;
  },

  // Get private closet photo URL
  async getClosetPhotoUrl(key: string) {
    const urlResult = await getUrl({
      key,
      options: {
        expiresIn: 3600 // 1 hour
      }
    });
    
    return urlResult.url;
  },

  // Upload profile picture (visible to other authenticated users)
  async uploadProfilePicture(file: File) {
    const user = await getCurrentUser();
    const fileExtension = file.name.split('.').pop();
    const key = `users/${user.userId}/profile/avatar.${fileExtension}`;
    
    const result = await uploadData({
      key,
      data: file,
      options: {
        contentType: file.type,
      }
    }).result;
    
    return result.key;
  },

  // Upload marketplace listing photo (public)
  async uploadMarketplacePhoto(file: File, listingId: string) {
    const user = await getCurrentUser();
    const fileExtension = file.name.split('.').pop();
    const key = `marketplace/listings/${listingId}/${Date.now()}.${fileExtension}`;
    
    const result = await uploadData({
      key,
      data: file,
      options: {
        contentType: file.type,
      }
    }).result;
    
    return result.key;
  },

  // Share outfit photos (authenticated users can view)
  async shareOutfit(photos: string[], outfitId: string) {
    const user = await getCurrentUser();
    const sharedKeys: string[] = [];
    
    for (const photoKey of photos) {
      // Copy from private closet to shared folder
      // This would require a Lambda function to copy between folders
      const sharedKey = `shared/outfits/${outfitId}/${photoKey.split('/').pop()}`;
      sharedKeys.push(sharedKey);
    }
    
    return sharedKeys;
  },

  // List user's closet items
  async listUserClosetPhotos() {
    const user = await getCurrentUser();
    const result = await list({
      prefix: `users/${user.userId}/closet/`,
      options: {
        pageSize: 100
      }
    });
    
    return result.items;
  },

  // Delete closet photo
  async deleteClosetPhoto(key: string) {
    await remove({ key });
  },

  // Clean up temporary files (older than 24 hours)
  async cleanupTempFiles() {
    const user = await getCurrentUser();
    const result = await list({
      prefix: `temp/${user.userId}/`,
    });
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    for (const item of result.items) {
      if (item.lastModified && item.lastModified.getTime() < oneDayAgo) {
        await remove({ key: item.key });
      }
    }
  }
};

// Updated closet.api.ts to use proper paths
export const closetApi = {
  async uploadPhotos(photos: File[], userId: string) {
    const uploadedKeys: string[] = [];
    
    for (const [index, photo] of photos.entries()) {
      const itemId = Date.now().toString(); // Temporary ID
      const key = await storageService.uploadClosetPhoto(photo, itemId);
      uploadedKeys.push(key);
    }
    
    return uploadedKeys;
  },

  async getPhotoUrls(keys: string[]) {
    const urls = await Promise.all(
      keys.map(key => storageService.getClosetPhotoUrl(key))
    );
    return urls;
  }
};
