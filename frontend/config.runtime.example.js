window.__API_CONFIG__ = {
  // no-id routes
  listPosts: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",
  createPost: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",

  // base URLs MUST end with /invoke/posts/ then query string
  getPostBase: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts/?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",
  updatePostBase: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts/?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",
  deletePostBase: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts/?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",

  // media bases should ALSO be /invoke/posts/ (UI appends /{id}/media_sas and /{id}/media_confirm)
  mediaSasBase: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts/?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",
  mediaConfirmBase: "https://<your-logic-app>/triggers/When_an_HTTP_request_is_received/paths/invoke/posts/?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=<sig>",
};
