# Hardening

**Append-only** persistent risk tracker. NEVER delete entries — mark a risk
resolved with a date instead. This is a permanent audit trail. Numbered `H-NN`.

## Risks

### H-01 — The family-wide conformance alarm silently unplugged itself: weekly matrix failed every run, then GitHub auto-disabled the cron after 60 days of repo inactivity

- **Severity**: high
- **Status**: open (2026-07-31)
- **Affected**: .github/workflows/conformance-matrix.yml (schedule trigger); the drift itself: spec/schema/agent-score+agent-data sources (fixed, D-005), attago lambda/payments derivedOpts provider-drop (OPEN, backend), js-sdk runner ignoring requiresSetup (OPEN, sdk)
- **Preconditions**: Any quiet period >60 days on this repo kills the cron — precisely the periods when drift accumulates unwatched.
- **Impact**: API-vs-spec drift (agent sources strings→objects, live since attago e590577 2026-03-02) went undetected for ~5 months. The matrix failed every visible run through 2026-05-31, then stopped entirely (repo last touched 2026-03-10 + 60d). No SDK ran red anywhere visible because js dev (the only per-repo conformance gate) was also dormant. First detection came from an unrelated push re-running CI on 2026-08-01.
- **Root cause**: GitHub disables scheduled workflows in inactive repos; the design assumed the cron was unconditional. A weekly failure also notified no one (no alerting on scheduled-run conclusions).
- **Reproduction**: gh workflow run conformance-matrix.yml → HTTP 422 "disabled workflow" (2026-08-01, before re-enable); run 30682379626 after re-enable: all four SDK jobs fail.
- **Recommended fix**: (1) Keep-alive: scheduled heartbeat commit/workflow or external monitor asserting the matrix RAN each week and alerting on red. (2) Residual: tighten sources items to required:[provider] after the attago derivedOpts fallback deploys. (3) Residual: type data-latest/data-push sources honestly (currently unconstrained array). (4) js runner: skip requiresSetup fixtures like go/py/rb.

### H-02 — Conformance depth varies wildly across the SDK family: only the ts runner validates response bodies against the schemas

- **Severity**: medium
- **Status**: open (2026-07-31)
- **Affected**: attago-py-sdk tests/conformance/test_conformance.py (status only); attago-go-sdk conformance_test.go (partial structural); attago-rb-sdk test/conformance/test_conformance.rb (key spot-checks)
- **Preconditions**: Any response-shape drift that keeps the HTTP status intact.
- **Impact**: The family presents four "conformance suites" but their verification depth differs by an order of magnitude: attago-js-sdk uses real JSON Schema validation (ajv 2020-12); attago-go-sdk hand-rolls partial structural checks (did NOT catch string-vs-object sources); attago-rb-sdk spot-checks a few keys per schema name; attago-py-sdk asserts HTTP STATUS ONLY (its 99-line runner ends at the status assertion). The 2026-08-01 matrix proved it operationally: identical live drift failed ts and passed py/go/rb. A schema drift the reference catches is invisible to 3 of 4 SDKs — matrix green from those jobs certifies far less than it appears to.
- **Root cause**: Each SDK hand-wrote its runner to its ecosystem convenience; the spec never stated a minimum verification contract for what a conformance runner MUST check (status + full schema validation of the body).
- **Reproduction**: Matrix run 30682634162: ts fails agent-data-success on /sources/N type; py/go/rb pass the same fixture against the same live API.
- **Recommended fix**: State the runner contract in this repo (README or a RUNNER-CONTRACT doc): a conforming runner validates status AND the full response body against the declared schema with a real JSON Schema 2020-12 validator. Bring py (jsonschema), go (santhosh-tekuri/jsonschema or similar), rb (json_schemer) up to it. Until then, read matrix green as ts-green + status-green elsewhere.
