# LandMate operations runbook — draft

**Status:** Local/container runbook only. No staging URL, monitoring, alerting, or
production service has been configured or verified.

## Provisional service objective

Draft target: **99.5% monthly availability** for the LandMate API health
endpoint, excluding planned maintenance. Over a 30-day month, the error budget
is `30 × 24 × 60 × 0.005 = 21.6 minutes`. This is a proposed objective, not
measured service performance; the team must agree on monitoring windows and
whether third-party AI outages are excluded.

## Startup and health checks

1. Confirm Node 24, pnpm 10.6.5, and dependency installation.
2. Start the API with `PORT=3000` and check `GET /api/healthz`.
3. Start the frontend with `PORT=5173`, `BASE_PATH=/`, then open
   `http://localhost:5173`.
4. For AI workflows, verify the server has non-empty
   `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` and
   `AI_INTEGRATIONS_ANTHROPIC_API_KEY`. Never print or paste the values into
   logs/issues.
5. For Docker Compose, run `docker compose ps` and inspect the health status
   before testing the web container.

## Common incidents

| Symptom                               | Checks                                                                                      | Recovery                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Browser cannot load the home page     | Check frontend process, `PORT`, `BASE_PATH`, and port 5173.                                 | Restart Vite; inspect terminal output.                                               |
| `/api/healthz` is unavailable         | Check API process, `PORT=3000`, and port conflicts.                                         | Restart API and verify the health endpoint before using the UI.                      |
| AI request returns an error           | Check credentials are set on the server only, provider quota/network, and API logs.         | Correct server environment and retry. Never log document text or credentials.        |
| PDF upload is rejected or has no text | Check that file is a machine-readable PDF under 10 MB.                                      | Ask user to paste text; scanned-image OCR is not implemented.                        |
| Suspected sensitive-data exposure     | Stop further testing with real documents; restrict access to logs and affected credentials. | Notify the team privacy/security lead and follow the institution's incident process. |

## Release / rollback

No staging deployment or rollback procedure exists yet. Before M5 sign-off,
document the approved hosting target, secrets-management process, immutable
image/tag, deployment owner, health verification, rollback command, and alert
contact.
