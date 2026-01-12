export const API = {
  // no-id routes
  listPosts: "https://<redacted>",
  createPost: "https://<redacted>",

  // base URLs MUST end with /invoke/posts/ then query string
  getPostBase: "https://<redacted>",
  updatePostBase: "https://<redacted>",
  deletePostBase: "https://<redacted>",

  // media bases should ALSO be /invoke/posts/ (UI appends /{id}/media_sas and /{id}/media_confirm)
  mediaSasBase: "https://<redacted>",
  mediaConfirmBase: "https://<redacted>",
};
