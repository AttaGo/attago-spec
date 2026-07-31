# Decisions

Project-wide architectural decision records (ADRs). Append-only. Numbered `D-NNN`.
Each entry carries a `**Status**` (`active` | `superseded` | `deprecated`). When a
decision supersedes another, the predecessor stays in the record — annotated in place
with a `**Superseded by**: D-NNN` back-ref and `**Status**: superseded` — so the
lifecycle is navigable and the current decision is the one that surfaces.

## Decisions

_(Add entries with `cz_add_decision`.)_

### D-001 — Spec lives in its own repo; SDKs CI-fetch it, never vendor it

**Context**: Four hand-written SDKs (TS, Python, Go, Ruby) must agree on the AttaGo wire format. Vendoring the spec into each SDK would let copies drift at four independent cadences.
**Decision**: The conformance contract lives in this dedicated repo. SDK CI fetches the latest spec at test time; this repo's conformance matrix conversely checks out each SDK weekly and runs its suite against the live API.
**Consequences**: One source of truth, drift surfaces as a red build in CI rather than a customer report; the cost is that a breaking spec change can redden four SDK builds at once and must be coordinated.
**Evidence**: attago repo docs/plans/2026-03-07-sdk-plan.md (architecture: 'SDK repos CI-fetch conformance spec from a shared spec repo'); .github/workflows/conformance-matrix.yml
**Status**: active (2026-07-31)

### D-002 — JSON Schema Draft 2020-12 is the contract language

**Context**: The spec needs a schema language every SDK ecosystem can validate natively or with mature tooling.
**Decision**: All response types are modeled as JSON Schema Draft 2020-12, one file per response type under spec/schema/.
**Consequences**: Uniform validation semantics across four language ecosystems; schema evolution is file-per-type and reviewable.
**Evidence**: CLAUDE.md (Rules), README.md (Structure)
**Status**: active (2026-07-31)

### D-003 — Fixtures are paired request/response documents organized by domain

**Context**: Bare response schemas cannot express auth headers, query shapes, or status codes, so an SDK could validate responses while still constructing requests wrongly.
**Decision**: Each fixture is one JSON file pairing a full request (method, path, headers, query) with the expected response (status, schema reference, body), organized under spec/fixtures/ by domain: rest/, mcp/, auth/, x402/.
**Consequences**: SDK conformance tests replay the request and validate the reply — both directions of the wire are covered; adding an endpoint means adding schema + fixture together.
**Evidence**: README.md (Fixture Format); CLAUDE.md (Structure)
**Status**: active (2026-07-31)

### D-004 — Conformance matrix runs weekly and on dispatch against live dev/staging

**Context**: Spec-vs-reality drift only shows against the deployed API, but hammering production on every push is neither needed nor safe.
**Decision**: conformance-matrix.yml runs on a weekly cron (Sunday 06:00 UTC) and manual workflow_dispatch with an environment choice (dev default, staging), using per-environment base URLs and API keys from repo secrets.
**Consequences**: Backend drift is caught within a week without coupling spec pushes to live-API load; an urgent check is one manual dispatch away.
**Evidence**: .github/workflows/conformance-matrix.yml
**Status**: active (2026-07-31)
