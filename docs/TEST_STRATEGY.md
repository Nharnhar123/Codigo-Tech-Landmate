# Test strategy — DCIT 415 M6 draft

**Status:** Initial automated tests are present. This draft does not claim that
the handbook's 70% domain branch coverage, two executable BDD scenarios, or a
browser E2E test have been achieved; collect and attach the reports before M6
submission.

## Test levels

| Level       | Scope                                                                                           | Current evidence / next action                                                                |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Unit        | Document classification, Claude response parsing, date/risk defaults.                           | `artifacts/api-server/src/lib/*.test.ts`; run `pnpm --filter @workspace/api-server run test`. |
| Integration | Express health endpoint starts without DB or AI secrets.                                        | `artifacts/api-server/src/app.test.ts`; add upload/validation and mocked AI route tests.      |
| BDD         | Citizen explains a document; PDF failure recovers to paste; process guide returns useful steps. | Write and execute feature scenarios against an agreed acceptance environment (pending).       |
| E2E         | Home → mode → paste text → results; failure/retry path.                                         | Add browser automation and a stub AI provider (pending).                                      |

## Quality gates

1. Run unit and integration tests on every pull request.
2. Measure branch coverage on domain code (`parseClaudeResponse.ts` and shared
   document classifier); target at least 70% branch coverage before M6 sign-off.
3. Add a browser E2E run for the main journey and a failure path.
4. Keep test documents synthetic. Do not place real citizen land documents or
   personal data in the repository, CI logs, or issue attachments.
5. Record test command, runtime/platform, pass/fail count, and coverage report
   artifact for each submission.

## Known test gaps

- No test currently exercises a real PDF upload, file size/type rejection, or
  an Anthropic timeout/retry.
- The AI provider must be stubbed; tests must not spend API credits or send real
  user content.
- Accessibility and 360 px viewport requirements need automated/manual evidence.
- Coverage threshold and exact domain-code scope must be agreed and verified.
