const runtimeConfig =
  typeof window !== 'undefined' ? window.__API_CONFIG__ || {} : {};

const requiredKeys = [
  'listPosts',
  'createPost',
  'getPostBase',
  'updatePostBase',
  'deletePostBase',
  'mediaSasBase',
  'mediaConfirmBase',
];

const missing = requiredKeys.filter((key) => !runtimeConfig[key]);
if (missing.length) {
  console.warn(
    `Missing API config keys: ${missing.join(', ')}. ` +
      'Create frontend/config.runtime.js from frontend/config.runtime.example.js.'
  );
}

export const API = {
  // no-id routes
  listPosts: runtimeConfig.listPosts || '',
  createPost: runtimeConfig.createPost || '',

  // base URLs MUST end with /invoke/posts/ then query string
  getPostBase: runtimeConfig.getPostBase || '',
  updatePostBase: runtimeConfig.updatePostBase || '',
  deletePostBase: runtimeConfig.deletePostBase || '',

  // media bases should ALSO be /invoke/posts/ (UI appends /{id}/media_sas and /{id}/media_confirm)
  mediaSasBase: runtimeConfig.mediaSasBase || '',
  mediaConfirmBase: runtimeConfig.mediaConfirmBase || '',
};
