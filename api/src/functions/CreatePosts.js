const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
const { randomUUID } = require("crypto");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB_NAME || "tsdb";
const containerName = process.env.COSMOS_CONTAINER_NAME || "posts";

function stripCosmosMeta(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const {
    _rid, _self, _etag, _attachments, _ts,
    ...clean
  } = doc;
  return clean;
}

app.http("CreatePost", {
  methods: ["POST"],
  authLevel: "function",
  route: "posts",
  handler: async (request, context) => {
    try {
      if (!endpoint || !key) {
        return { status: 500, jsonBody: { error: "Missing COSMOS_ENDPOINT/COSMOS_KEY" } };
      }

      const body = await request.json().catch(() => null);
      if (!body) {
        return { status: 400, jsonBody: { error: "Request body must be JSON." } };
      }

      const title = typeof body.title === "string" ? body.title.trim() : "";
      const content = typeof body.content === "string" ? body.content.trim() : "";
      const author = typeof body.author === "string" ? body.author.trim() : "";

      if (!title || !content || !author) {
        return {
          status: 400,
          jsonBody: { error: "Missing required fields: title, content, author." }
        };
      }

      const now = new Date().toISOString();

      const doc = {
        id: randomUUID(),
        pk: "POST",
        title,
        content,
        author,
        mediaUrl: null,
        createdAt: now,
        updatedAt: now
      };

      const client = new CosmosClient({ endpoint, key });
      const container = client.database(dbName).container(containerName);

      const { resource } = await container.items.create(doc);

      return {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        jsonBody: stripCosmosMeta(resource)
      };
    } catch (err) {
      context.error(err);
      return { status: 500, jsonBody: { error: "Failed to create post", details: err.message } };
    }
  }
});
