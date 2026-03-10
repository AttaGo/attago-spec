# AttaGo Conformance Spec

JSON Schema definitions and request/response fixtures for the AttaGo API.
Used by SDK implementations to validate conformance.

## Structure

- `spec/schema/` — JSON Schema (Draft 2020-12) for all response types
- `spec/fixtures/` — Request/response fixture pairs organized by domain
  - `rest/` — REST API endpoints
  - `mcp/` — MCP JSON-RPC protocol
  - `auth/` — Authentication flows
  - `x402/` — Payment protocol

## Fixture Format

Each fixture is a JSON file:
```json
{
  "description": "What this fixture tests",
  "request": {
    "method": "GET",
    "path": "/v1/agent/score",
    "headers": { "X-API-Key": "ak_live_example" },
    "query": { "symbol": "BTC" }
  },
  "response": {
    "status": 200,
    "schema": "agent-score",
    "body": { ... }
  }
}
```

## Validation

```bash
node validate.js
```
