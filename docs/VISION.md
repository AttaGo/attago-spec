# Vision

## What & Why

The single source of truth for what the AttaGo API says on the wire. AttaGo
ships four hand-written, idiomatic SDKs (TypeScript, Python, Go, Ruby); the
only way four independent implementations stay honest is a shared conformance
contract that none of them owns. This repo is that contract: JSON Schemas for
every response type plus request/response fixture pairs, validated
continuously against the live API.

The SDKs never vendor the spec — their CI fetches it fresh, and this repo's
weekly conformance matrix drives all four SDK conformance suites against the
dev/staging API. Drift between an SDK, the spec, and the deployed backend
surfaces as a red build here, not as a customer bug report.

## Differentiation

- Fixtures are *paired* request/response documents, not bare schemas — they
  encode auth headers, query shapes, and status codes, so an SDK conformance
  test replays the request and validates the reply.
- The matrix tests the *live* API, not a mock: the spec is checked against
  reality in both directions (fixtures validate against schemas locally;
  SDKs validate live responses against the same schemas weekly).

## Scope Boundaries

- Not an SDK: no client code lives here. SDKs live in `attago-js-sdk`,
  `attago-py-sdk`, `attago-go-sdk`, `attago-rb-sdk`.
- Not the API definition of record for the backend team: the internal OpenAPI
  spec lives in the main `attago` repo (`docs/openapi-internal.yaml`); this
  repo mirrors its public surface and must be kept in sync with it.
- Not documentation for humans: `https://attago.bid/docs` is the public API
  reference. This repo is machine-consumed.
