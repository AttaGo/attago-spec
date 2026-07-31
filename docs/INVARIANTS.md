# Invariants

Rules that hold across all work. Append-only. Numbered `INVARIANT-NN`.

## Invariants

_(Add entries with `cz_add_invariant`.)_

### INVARIANT-01 — Every fixture response body MUST validate against its declared schema — validate.js enforces this locally and in CI (validate.yml); a fixture that fails validation never merges.
**Introduced by**: CLAUDE.md (Rules)
**Audience**: engineering

Every fixture response body MUST validate against its declared schema — validate.js enforces this locally and in CI (validate.yml); a fixture that fails validation never merges.

### INVARIANT-02 — Schemas MUST stay in sync with the internal OpenAPI spec in the main attago repo (docs/openapi-internal.yaml) — this repo mirrors the public surface, it does not fork it.
**Introduced by**: CLAUDE.md (Rules)
**Audience**: engineering

Schemas MUST stay in sync with the internal OpenAPI spec in the main attago repo (docs/openapi-internal.yaml) — this repo mirrors the public surface, it does not fork it.

### INVARIANT-03 — A fixture's response.schema field references the schema FILENAME WITHOUT EXTENSION (e.g. "agent-score" for spec/schema/agent-score.schema.json).
**Introduced by**: CLAUDE.md (Rules); README.md (Fixture Format)
**Audience**: engineering

A fixture's response.schema field references the schema FILENAME WITHOUT EXTENSION (e.g. "agent-score" for spec/schema/agent-score.schema.json).
