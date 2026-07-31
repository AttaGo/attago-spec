# Architecture

Subsystems, capabilities, and components. Tracked entities live in
`docs/subsystems/` and `docs/features/` with frontmatter that declares the
Project DAG; this doc is the prose overview.

## Subsystems

- **Schemas** (`spec/schema/`) — one JSON Schema (Draft 2020-12) file per API
  response type (`agent-score`, `data-latest`, `error-4xx`, …). These model
  the public surface of the AttaGo backend and must track the internal
  OpenAPI spec in the main `attago` repo.
- **Fixtures** (`spec/fixtures/`) — request/response pairs organized by
  domain: `rest/` (REST endpoints), `mcp/` (MCP JSON-RPC protocol), `auth/`
  (authentication flows), `x402/` (payment protocol). Each fixture is one
  JSON file: `{description, request{method, path, headers, query},
  response{status, schema, body}}`, where `response.schema` names a schema
  file *without* extension.
- **Validator** (`validate.js`) — Node script that validates every fixture's
  response body against its declared schema. The local and per-push (CI
  `validate.yml`) correctness gate.
- **Conformance matrix** (`.github/workflows/conformance-matrix.yml`) — the
  cross-repo integration harness: weekly cron (Sun 06:00 UTC) + manual
  dispatch, checks out each of the four SDK repos, runs that SDK's own
  conformance suite against the dev or staging live API with
  `ATTAGO_SPEC_DIR` pointing at this checkout. Per-environment base URLs and
  API keys come from repo secrets.

## Capabilities

- **Bidirectional validation**: fixtures validate against schemas locally
  (fast, hermetic); SDK suites validate live API responses against the same
  schemas weekly (slow, real). A schema error fails both; a backend drift
  fails the matrix only — which is the signal that distinguishes them.
- **Consumers**: the four SDK repos (`attago-js-sdk` — the reference
  implementation — `attago-py-sdk`, `attago-go-sdk`, `attago-rb-sdk`) each
  run conformance against this spec in their own CI and in the matrix here.
  Origin story and cross-repo plan: `attago` repo,
  `docs/plans/2026-03-07-sdk-plan.md`.
