# LandMate

LandMate is a proposed DCIT 415 capstone project: an anonymous, mobile-friendly
guide that helps people in Ghana understand Lands Commission land documents,
review potential warning signs, find process guidance, and get help with forms.
The application uses a React/Vite frontend, an Express API, and Anthropic Claude
for AI-generated guidance.

> **Project approval:** The DCIT 415 handbook lists ten default project options
> and permits a similar-scope team proposal with lecturer approval by Week 2.
> LandMate is not one of the ten listed options. Confirm that the lecturer has
> approved LandMate before presenting it as an approved capstone.

## Run locally (Windows PowerShell)

Requirements: Node.js 24 and pnpm 10.6.5.

```powershell
pnpm install
```

In the first terminal, start the API:

```powershell
$env:PORT='3000'
pnpm --filter @workspace/api-server run dev
```

In a second terminal, start the frontend:

```powershell
$env:PORT='5173'
$env:BASE_PATH='/'
pnpm --filter @workspace/landmate run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend proxies API
requests to `http://127.0.0.1:3000` by default. Override this with `API_URL`.
`GET /api/healthz` works without database or AI credentials. Document analysis,
process guidance, form assistance, chat, and PDF extraction require valid
`AI_INTEGRATIONS_ANTHROPIC_BASE_URL` and `AI_INTEGRATIONS_ANTHROPIC_API_KEY`
environment variables on the API server. Never put these credentials in the
frontend or commit them.

## Run with Docker Compose

Copy `.env.example` to `.env`, add the Anthropic integration credentials for AI
features, then run:

```powershell
docker compose up --build
```

Open [http://localhost:4173](http://localhost:4173). The application is
anonymous and does not persist uploaded documents or analysis results.

## Project layout

- `artifacts/landmate/` — React 19/Vite client and citizen workflows.
- `artifacts/api-server/` — Express API, document extraction, Claude prompts,
  parsing, and health endpoint.
- `lib/api-spec/` — OpenAPI contract and code-generation configuration.
- `lib/api-client-react/`, `lib/api-zod/` — generated client and shared schemas.
- `lib/integrations-anthropic-ai/` — server-side Anthropic client and batch
  helpers.
- `docs/` — draft DCIT 415 milestone artefacts and known gaps.

## Checks

```powershell
pnpm --filter @workspace/api-server run test
$env:PORT='5173'; $env:BASE_PATH='/'; pnpm --filter @workspace/landmate run build
pnpm run typecheck
```

The test strategy and outstanding capstone acceptance work are recorded in
[docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md) and
[docs/PLAN.md](docs/PLAN.md). Operational checks are in
[docs/RUNBOOK.md](docs/RUNBOOK.md).
