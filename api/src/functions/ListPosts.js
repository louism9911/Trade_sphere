const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB_NAME || "tsdb";
const containerName = process.env.COSMOS_CONTAINER_NAME || "posts";

app.http("ListPosts", {
  methods: ["GET"],
  authLevel: "function",
  route: "posts",
  handler: async (request, context) => {
    try {
      if (!endpoint || !key) {
        return {
          status: 500,
          jsonBody: { error: "Missing COSMOS_ENDPOINT/COSMOS_KEY" }
        };
      }

      const client = new CosmosClient({ endpoint, key });
      const container = client.database(dbName).container(containerName);

      const query = {
        query: "SELECT * FROM c WHERE c.pk = @pk ORDER BY c.createdAt DESC",
        parameters: [{ name: "@pk", value: "POST" }]
      };

      const { resources } = await container.items.query(query).fetchAll();

      return {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        jsonBody: resources
      };
    } catch (err) {
      context.error(err);
      return { status: 500, jsonBody: { error: err.message } };
    }
  }
});
