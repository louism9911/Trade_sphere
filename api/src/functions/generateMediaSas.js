const { app } = require("@azure/functions");
const { BlobSASPermissions, SASProtocol, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { randomUUID } = require("crypto");

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const containerName = process.env.STORAGE_CONTAINER_NAME || "media";

app.http("GenerateMediaSas", {
  methods: ["POST"],
  authLevel: "function",
  route: "posts/{id}/media-sas",
  handler: async (request, context) => {
    try {
      const postId = request.params.id;
      if (!postId) return { status: 400, jsonBody: { error: "Missing post id." } };

      if (!accountName || !accountKey) {
        return { status: 500, jsonBody: { error: "Missing STORAGE_ACCOUNT_NAME/STORAGE_ACCOUNT_KEY" } };
      }

      // Optional body: { "fileName": "video.mp4", "contentType": "video/mp4" }
      const body = await request.json().catch(() => ({}));
      const fileName = typeof body.fileName === "string" ? body.fileName : "";
      const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";

      // blob name: posts/<postId>/<uuid>.<ext>
      const blobName = `posts/${postId}/${randomUUID()}.${ext}`;

      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

      const now = new Date();
      const expiresOn = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

      const sas = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse("cw"), // create + write
          startsOn: new Date(now.getTime() - 60 * 1000),
          expiresOn,
          protocol: SASProtocol.Https
        },
        sharedKeyCredential
      ).toString();

      const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}?${sas}`;
      const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}`;

      return {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        jsonBody: {
                postId,
                blobName,
                blobUrl,
                uploadUrl,
                expiresOn: expiresOn.toISOString(),
                fileName,
                contentType: typeof body.contentType === "string" ? body.contentType : null,
                requiredMethod: "PUT",
                requiredHeaders: {
                    "x-ms-blob-type": "BlockBlob"
                }
            }
      };
    } catch (err) {
      context.error(err);
      return { status: 500, jsonBody: { error: "Failed to generate SAS", details: err.message } };
    }
  }
});
