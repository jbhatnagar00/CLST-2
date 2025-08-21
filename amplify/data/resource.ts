import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
 * Define your data model with authorization rules
 */
const schema = a.schema({
  ClosetItem: a
    .model({
      brand: a.string().required(),
      itemName: a.string().required(),
      category: a.string().required(),
      size: a.string().required(),
      color: a.string().required(),
      photoKeys: a.string().array().required(),
      userId: a.string(),
    })
    .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
