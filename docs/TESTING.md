# Testing

## Test Discipline

The validator is the gate: every fixture's `response.body` must validate
against its declared JSON Schema before merge. `validate.js` runs locally
(`node validate.js`) and on every push via CI (`validate.yml`). There are no
unit tests here — the repo *is* the test data; the validator proves internal
consistency, and the weekly conformance matrix
(`conformance-matrix.yml`) proves external truth by running all four SDK
conformance suites against the live dev/staging API with this checkout as
`ATTAGO_SPEC_DIR`.

## Runner & Baseline

- Runner: `node validate.js` (all-or-nothing; no per-test granularity)
- Baseline: 58 files checked, 0 errors (2026-07-31)

## Coverage Policy

Every schema in `spec/schema/` must be exercised by at least one fixture, and
every public API surface change lands here as schema + fixture *before* SDK
conformance suites can assert it. New endpoints or response shapes without a
fixture are invisible to the matrix — adding the fixture is what makes drift
detectable.
