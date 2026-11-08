# Delivery plan — DCIT 415 M8 draft

**Status:** Planning assumptions only. Team, dates, owners, lecturer approval,
and actual progress must be completed by the group.

## WBS and provisional PERT estimates

Estimates are working days: `E = (O + 4M + P) / 6`. They are not commitments.

| ID  | Work package                                       |   O |   M |   P | E (days) | Predecessor |
| --- | -------------------------------------------------- | --: | --: | --: | -------: | ----------- |
| A   | Confirm scope, lecturer approval, and team charter |   1 |   2 |   4 |     2.17 | —           |
| B   | M1 requirements and acceptance criteria            |   2 |   3 |   5 |     3.17 | A           |
| C   | M2 architecture and ADRs                           |   2 |   3 |   5 |     3.17 | B           |
| D   | M3 code-quality baseline and refactoring           |   2 |   4 |   6 |     4.00 | C           |
| E   | M4 containers and health/resilience                |   2 |   3 |   5 |     3.17 | C           |
| F   | M5 CI/CD and staging                               |   3 |   4 |   7 |     4.33 | D, E        |
| G   | M6 tests and coverage                              |   3 |   5 |   8 |     5.17 | D, E        |
| H   | M7 security/privacy and scans                      |   2 |   4 |   7 |     4.17 | F, G        |
| I   | M8 plan/risk and final report                      |   2 |   3 |   5 |     3.17 | H           |
| J   | Final demo rehearsal and evidence pack             |   2 |   3 |   5 |     3.17 | I           |

## CPM (using expected durations above)

Forward/backward pass on the draft dependencies, with finish after J:

| ID  |    ES |    EF |    LS |    LF | Slack |
| --- | ----: | ----: | ----: | ----: | ----: |
| A   |  0.00 |  2.17 |  0.00 |  2.17 |  0.00 |
| B   |  2.17 |  5.34 |  2.17 |  5.34 |  0.00 |
| C   |  5.34 |  8.51 |  5.34 |  8.51 |  0.00 |
| D   |  8.51 | 12.51 |  8.51 | 12.51 |  0.00 |
| E   |  8.51 | 11.68 |  9.34 | 12.51 |  0.83 |
| F   | 12.51 | 16.84 | 13.35 | 17.68 |  0.84 |
| G   | 12.51 | 17.68 | 12.51 | 17.68 |  0.00 |
| H   | 17.68 | 21.85 | 17.68 | 21.85 |  0.00 |
| I   | 21.85 | 25.02 | 21.85 | 25.02 |  0.00 |
| J   | 25.02 | 28.19 | 25.02 | 28.19 |  0.00 |

**Draft critical path:** A → B → C → D → G → H → I → J (28.19 expected
working days). Recalculate after the team confirms scope, calendar, and
resource constraints.

## Risk register (RRL = probability × impact, 1–5 scales)

| Risk                                                  |   P |   I | RRL | Response / owner                                                                                            |
| ----------------------------------------------------- | --: | --: | --: | ----------------------------------------------------------------------------------------------------------- |
| Lecturer does not approve the custom project proposal |   3 |   5 |  15 | Submit proposal by Week 2; retain an approved-project fallback. Product owner (TBD).                        |
| AI provider credentials/quota unavailable for demo    |   3 |   4 |  12 | Use a deterministic stub for tests and demo fallback; never expose keys. DevOps lead (TBD).                 |
| Outdated or inaccurate GLC fee/process claims         |   3 |   5 |  15 | Source and date every claim; verify with official sources and disclose uncertainty. Product owner (TBD).    |
| Personal document content is exposed to logs/provider |   2 |   5 |  10 | Use synthetic documents, review provider terms, redact logs, document notice/retention. Privacy lead (TBD). |
| Team cannot meet test/coverage requirement            |   4 |   4 |  16 | Agree coverage scope early, add tests each PR, reserve sprint capacity for test gaps. QA lead (TBD).        |
| External service or network failure during live demo  |   3 |   4 |  12 | Preflight health, prepare recorded/stubbed failure-path demonstration. DevOps lead (TBD).                   |

## RACI (roles unassigned)

| Activity                | Product owner | Architect | QA lead | DevOps lead | Security/privacy | UX/docs |
| ----------------------- | ------------- | --------- | ------- | ----------- | ---------------- | ------- |
| Requirements/backlog    | A/R           | C         | C       | I           | C                | C       |
| Architecture/ADRs       | C             | A/R       | C       | C           | C                | I       |
| Tests/coverage          | C             | C         | A/R     | C           | I                | I       |
| Containers/CI/staging   | I             | C         | C       | A/R         | C                | I       |
| Threat/privacy review   | I             | C         | C       | C           | A/R              | C       |
| User guide/final report | C             | C         | C       | C           | C                | A/R     |

**A** accountable, **R** responsible, **C** consulted, **I** informed. The group
must put member names against these roles and agree rotation/backup owners.

## Status report (initial)

- Completed in repository: existing application, first-pass M1/M2 draft,
  integration/unit test scaffolding, API health endpoint, container/CI files
  pending local verification.
- Blocked: lecturer approval; team charter/roles; AI credentials; staging URL;
  verified GLC sources; real coverage/security-scan evidence.
- Next: confirm approval and roster, complete request-validation and upload
  tests, run CI/Docker end to end, close high-risk debt, capture evidence.
