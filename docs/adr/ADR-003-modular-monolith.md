# ADR-003: Keep the API as a modular monolith

- **Status:** Accepted for the capstone MVP.
- **Context:** The product has a small set of synchronous API use cases and one
  external AI dependency. Splitting document extraction, prompt routing, and
  parsing into independently deployed services would add deployment and
  observability costs without a demonstrated scaling need.
- **Decision:** Keep one Express API process and separate route, extraction,
  classification, prompt, AI-client, and response-parser modules.
- **Consequences:** Simpler local setup and test deployments; API scaling and
  provider rate limits remain shared concerns. Add a queue/service boundary only
  if measured workload justifies it.
- **Alternatives:** Microservices (rejected for MVP); a single large route file
  (rejected because responsibilities become harder to test and review).
