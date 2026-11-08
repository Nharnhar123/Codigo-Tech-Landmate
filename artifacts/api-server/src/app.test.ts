import assert from "node:assert/strict";
import { once } from "node:events";
import { after, test } from "node:test";
import { MAX_DOCUMENT_UPLOAD_BYTES } from "@workspace/api-zod";
import app from "./app.js";

const server = app.listen(0);
await once(server, "listening");

after(async () => {
  server.close();
  await once(server, "close");
});

test("health endpoint works without a database or AI credentials", async () => {
  const address = server.address();
  assert.ok(address && typeof address !== "string");

  const response = await fetch(`http://127.0.0.1:${address.port}/api/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("AI endpoint reports missing server credentials clearly", async () => {
  const savedBaseUrl = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  const savedApiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  delete process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  delete process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/landmate/analyze`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          documentText: "Sample document text",
          documentType: "unknown",
          mode: "explain",
        }),
      },
    );

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error: "AI service not configured",
      message: "The server is missing its Anthropic AI configuration.",
    });
  } finally {
    if (savedBaseUrl === undefined) {
      delete process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
    } else {
      process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL = savedBaseUrl;
    }

    if (savedApiKey === undefined) {
      delete process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
    } else {
      process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY = savedApiKey;
    }
  }
});

test("PDF upload rejects files larger than the configured limit", async () => {
  const address = server.address();
  assert.ok(address && typeof address !== "string");

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(MAX_DOCUMENT_UPLOAD_BYTES + 1)], {
      type: "application/pdf",
    }),
    "oversized.pdf",
  );

  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/landmate/extract-text`,
    {
      method: "POST",
      body: formData,
    },
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: "File too large",
    message: "Please upload a file no larger than 4 MB.",
  });
});
