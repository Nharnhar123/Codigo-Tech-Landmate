# LandMate architecture — DCIT 415 M2 draft

**Status:** Implementation-derived draft. Service availability assumptions are
illustrative, not measured SLOs.

## C4 Level 1 — system context

```mermaid
C4Context
  title LandMate System Context
  Person(citizen, "Citizen", "Uploads or pastes a land document and requests guidance.")
  Person(team, "Project team", "Maintains LandMate and reviews GLC knowledge.")
  System(landmate, "LandMate", "Anonymous web app for GLC document and process guidance.")
  System_Ext(claude, "Anthropic Claude API", "Generates explanations, risk summaries, and guidance.")
  System_Ext(glc, "Ghana Lands Commission", "Official source for land processes; no live integration.")
  Rel(citizen, landmate, "Uses over HTTPS in production")
  Rel(landmate, claude, "Sends prompt and user-provided context over HTTPS")
  Rel(team, landmate, "Develops and updates prompts/process content")
  Rel(citizen, glc, "Verifies official requirements outside the application")
```

## C4 Level 2 — containers

```mermaid
C4Container
  title LandMate Containers
  Person(citizen, "Citizen", "Anonymous end user")
  System_Boundary(system, "LandMate") {
    Container(web, "Web client", "React 19, TypeScript, Vite", "Mode selection, upload/paste, results, and in-memory session state.")
    Container(api, "API server", "Node.js 24, Express 5", "PDF extraction, classification, prompt selection, Claude calls, and response parsing.")
    ContainerDb(none, "No LandMate document database", "None", "The MVP does not persist uploaded documents or results.")
  }
  System_Ext(claude, "Anthropic Claude API", "External AI inference.")
  System_Ext(glc, "Ghana Lands Commission", "Official process verification; no system integration.")
  Rel(citizen, web, "Uses")
  Rel(web, api, "JSON / multipart REST requests")
  Rel(api, claude, "HTTPS messages API; server-side credential")
  Rel(citizen, glc, "Verifies decisions and current fees")
```

## C4 Level 3 — API server

```mermaid
C4Component
  title LandMate API Components
  Container_Boundary(api, "Express API server") {
    Component(routes, "LandMate routes", "Express router", "Analyze, process guidance, form assistance, chat, and PDF extraction.")
    Component(extractor, "PDF extractor", "pdf-parse / multer memory storage", "Extracts text from machine-readable PDFs.")
    Component(classifier, "Document classifier", "Shared TypeScript helper", "Classifies text with GLC keyword groups.")
    Component(prompts, "Prompt templates", "TypeScript", "Supplies language-specific GLC guidance instructions.")
    Component(ai, "AI client", "Anthropic SDK", "Lazy initialization, server-side key, 30-second timeout.")
    Component(parser, "Response parser", "TypeScript", "Parses structured AI output to typed API results.")
    Component(health, "Health route", "Express", "Reports process liveness at /api/healthz.")
  }
  System_Ext(claude, "Anthropic Claude API", "External inference")
  Rel(routes, extractor, "Extracts uploaded PDF")
  Rel(routes, classifier, "Classifies extracted text")
  Rel(routes, prompts, "Selects feature/language prompt")
  Rel(routes, ai, "Requests inference")
  Rel(ai, claude, "HTTPS")
  Rel(routes, parser, "Parses response")
  Rel(health, routes, "Mounted under /api")
```

## Quality-attribute scenarios

| Attribute       | Stimulus                                             | Response / measurable target                                                                                                            | Verification                                                                |
| --------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Availability    | Anthropic is unavailable or times out.               | Return a safe, retryable API error within 30 seconds; retain client state.                                                              | Stub timeout/provider failure in integration tests.                         |
| Confidentiality | User uploads a document containing personal details. | Process in memory, do not log its body or persist a LandMate copy, and send only the request context needed to the configured provider. | Code/config review and upload test; obtain provider/data-protection review. |
| Performance     | A text-based PDF up to 5 MB is uploaded.             | Extract in ≤3 seconds on the agreed reference test environment.                                                                         | 20-run timed integration test; report p95 and environment.                  |
| Usability       | A citizen uses a 360 px mobile viewport.             | Complete a primary journey without horizontal scrolling or sub-44 px controls.                                                          | Browser E2E and manual mobile/accessibility audit.                          |

## Availability estimate (series path)

For the illustrative request path with independent components at 99.9%, 99.95%,
and 99.5% availability:

`A_series = 0.999 × 0.9995 × 0.995 = 0.993507975 = 99.3508%`.

If the weakest (99.5%) component is duplicated in parallel and failures are
independent:

`A_weak_pair = 1 - (1 - 0.995)^2 = 99.9975%`.

`A_total = 0.999 × 0.9995 × 0.999975 = 99.8476%`.

This is a classroom calculation, not LandMate's measured availability. The
external AI provider and user network are not controlled by this application.

## Architecture decision records

See [ADR-001](../adr/ADR-001-anonymous-client-session.md),
[ADR-002](../adr/ADR-002-server-side-ai-provider.md), and
[ADR-003](../adr/ADR-003-modular-monolith.md).
