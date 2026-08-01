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
