# ADR-001: Anonymous, non-persistent citizen sessions

- **Status:** Accepted for the MVP; lecturer/team confirmation pending.
- **Context:** The LandMate SRS requires that citizens can use the core features
  without accounts and that uploaded document text/results are not stored as
  LandMate records. Persistent account storage increases privacy and operational
  scope.
- **Decision:** Keep the core journey anonymous and hold current document,
  results, and chat state in React memory. New Session clears that state. Do not
  make login or a database a prerequisite for the citizen guide.
- **Consequences:** Refreshing or closing the tab loses work. It reduces
  persistence risk but does not prevent the external AI provider from processing
  the submitted content. Remove or disable unused auth UI/API wiring before
  production; inspect logs and provider terms.
- **Alternatives:** Persistent accounts/history (rejected for MVP); browser
  localStorage (rejected because sensitive text would outlive the session).
