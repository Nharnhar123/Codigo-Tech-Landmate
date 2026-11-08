# Technical-debt register — DCIT 415 M3 draft

| ID    | Debt                                                                       | Evidence / impact                                                                                                        | Priority | Proposed action / status                                                          |
| ----- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------- |
| TD-01 | No complete API input validation.                                          | Request bodies are cast to TypeScript types; malformed values can reach prompt construction.                             | High     | Validate every route with shared Zod schemas and test invalid values.             |
| TD-02 | Upload validation is incomplete.                                           | API accepts based on PDF MIME **or** `.pdf` suffix, and returns a distinct unsupported image response.                   | High     | Require allowed PDF MIME and extension, reject mismatches, add integration cases. |
| TD-03 | No per-IP rate limiting.                                                   | AI endpoint can be repeatedly invoked.                                                                                   | High     | Add a shared production-safe limiter and verify proxy/IP configuration.           |
| TD-04 | Document classifier keyword matching is heuristic.                         | False positives/negatives possible; no curated evaluation corpus.                                                        | Medium   | Add labelled synthetic examples, measure precision/recall, review overlap.        |
| TD-05 | SRS feature gaps remain.                                                   | OCR, request validation, retry UX, and some results/chat details are incomplete.                                         | Medium   | Track requirements in M1 backlog and close only with test evidence.               |
| TD-06 | Existing app UI contains untyped/loose values and TypeScript diagnostics.  | Workspace typecheck has failed on legacy code.                                                                           | High     | Fix type errors before enabling a required CI typecheck gate.                     |
| TD-07 | Process facts and cost ranges are embedded in the frontend.                | Values can become stale and are not linked to dated official sources.                                                    | Medium   | Move to a reviewed, dated knowledge file and add source metadata.                 |
| TD-08 | No measured coverage, browser E2E, or security-scan baseline.              | Cannot claim M5/M6/M7 gates currently pass.                                                                              | High     | Add CI evidence and save dated reports; current checks are draft only.            |
| TD-09 | Generated OpenAPI client still contains unused Replit/OIDC auth contracts. | The anonymous MVP no longer mounts the auth router; generated auth methods are stale and could mislead future consumers. | Medium   | Remove auth paths from the OpenAPI source and regenerate all clients/schemas.     |

## Coding standards

- TypeScript strict checks; avoid `any`, unsafe type assertions, and ignored
  compiler errors. Validate untrusted API inputs at runtime.
- Keep HTTP handlers thin; put parsing/classification/AI boundary logic in
  modules that can be unit tested without a network or credential.
- Never log document text, chat content, secrets, or provider authorization
  headers.
- Use structured safe errors and stable HTTP status codes.
- Keep prompt templates and GLC knowledge separately reviewable; include source
  and review date for process/fee facts.
- Require a peer-reviewed pull request for behavior changes; add/update tests
  with each change.
- Format changed files with Prettier; run lint, typecheck, and relevant tests
  before requesting review.

## Metrics

SonarCloud/radon-style analysis is not configured for this TypeScript monorepo.
Do not report a baseline or improvement until a tool is selected, configured,
and run on a named revision. The refactoring PR and before/after metrics are
still required for M3.
