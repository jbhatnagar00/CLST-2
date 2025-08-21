import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'clstStorage',
  access: (allow) => ({
    // User's private closet items - only owner can access
    'users/{entity_id}/closet/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    
    // Profile pictures - owner can write, others can read
    'users/{entity_id}/profile/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read'])
    ],
    
    // Marketplace listings - public read, authenticated write
    'marketplace/listings/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['write', 'delete'])
    ],
    
    // Shared outfits - authenticated users can read
    'shared/outfits/*': [
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['write', 'delete'])
    ],
    
    // Temporary uploads folder - for processing
    'temp/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});
