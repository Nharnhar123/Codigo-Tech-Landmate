import assert from "node:assert/strict";
import { once } from "node:events";
import { after, test } from "node:test";
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
