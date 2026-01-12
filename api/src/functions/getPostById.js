const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB_NAME || "tsdb";
const containerName = process.env.COSMOS_CONTAINER_NAME || "posts";

function stripCosmosMeta(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const { _rid, _self, _etag, _attachments, _ts, ...clean } = doc;
  return clean;
}

app.http("GetPostById", {
  methods: ["GET"],
  authLevel: "function",
  route: "posts/{id}",
  handler: async (request, context) => {
    try {
      if (!endpoint || !key) {
        return { status: 500, jsonBody: { error: "Missing COSMOS_ENDPOINT/COSMOS_KEY" } };
      }

      const id = request.params.id;
      if (!id) {
        return { status: 400, jsonBody: { error: "Missing post id." } };
      }

      const client = new CosmosClient({ endpoint, key });
      const container = client.database(dbName).container(containerName);

      try {
        const { resource } = await container.item(id, "POST").read();

        if (!resource) {
          return { status: 404, jsonBody: { error: "Post not found." } };
        }

        return {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
          jsonBody: stripCosmosMeta(resource)
        };
      } catch (err) {
        if (err.code === 404) {
          return { status: 404, jsonBody: { error: "Post not found." } };
        }
        throw err;
      }
    } catch (err) {
      context.error(err);
      return { status: 500, jsonBody: { error: "Failed to get post", details: err.message } };
    }
  }
});