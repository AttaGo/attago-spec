# AttaGo Conformance Spec

## Purpose
Public conformance spec for AttaGo SDK implementations. Contains JSON Schemas and request/response fixtures.

## Structure
- `spec/schema/` — JSON Schema Draft 2020-12 files (one per response type)
- `spec/fixtures/` — Request/response fixture pairs (organized by domain)
- `validate.js` — Validates all fixtures against their referenced schemas

## Commands
```bash
node validate.js   # Validate all fixtures against schemas
```

## Rules
- Schemas use JSON Schema Draft 2020-12
- All fixture response bodies must validate against their declared schema
- Keep schemas in sync with the OpenAPI spec in the main attago repo
- Fixture `response.schema` field references schema filename without extension
