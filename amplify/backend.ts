import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  storage,
  data
});

// Add this to generate outputs
backend.addOutput({
  custom: {
    version: "1"
  }
});
