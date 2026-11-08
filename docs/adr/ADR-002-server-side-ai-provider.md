# ADR-002: Call the AI provider only from the API server

- **Status:** Accepted.
- **Context:** LandMate needs Claude for document analysis, but the SRS prohibits
  placing the Anthropic key in the browser bundle. The API is also the boundary
  for timeouts, input limits, and prompt construction.
- **Decision:** The React client calls the Express API. The API lazily creates
  the Anthropic SDK client from server-side environment variables, uses the
  configured model, and applies a 30-second SDK timeout.
- **Consequences:** The client can start and health-check without AI credentials,
  but AI endpoints require a valid configured integration. AI output and user
  content leave the application boundary; communicate this to users and verify
  provider data terms before production.
- **Alternatives:** Direct browser-to-Anthropic calls (rejected: exposes the
  secret); local-only rules (insufficient for the proposed guidance features).
