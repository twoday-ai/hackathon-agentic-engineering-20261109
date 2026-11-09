# Architecture notes

Instructor discovery map, inspected 2026-11-09. Follow [project guidance](../AGENTS.md),
[canonical policy](rules.md) and [API contract](api-contract.md); this map does not add rules.

## Calls and data flow

| Boundary | Actual path |
| --- | --- |
| Component calls | [main.tsx](../web/src/main.tsx) mounts `App`; [App](../web/src/App.tsx) calls `api.list` on mount and `api.detail` on selection, storing responses in React state. Search filters loaded rows locally. |
| HTTP | [api.ts](../web/src/api.ts): `api.list/detail` -> `request<T>` -> browser `fetch`. [Vite](../web/vite.config.ts) proxies `/api` to port 5080 in development. |
| List | [Endpoints.MapWorkshopEndpoints](../api/Endpoints.cs): `GET /api/requests` -> `WorkshopDb.Requests.AsNoTracking` -> municipality ordering -> `RequestSummary` -> JSON. |
| Detail | Same endpoint module: GUID lookup with activity -> [RequestDetail.From](../api/Contracts.cs) -> `Readiness.Evaluate` (currently null) -> JSON -> `App.setDetail`. Unknown GUID returns 404. |
| Edit/save/read | No editor or PUT endpoint exists. `api.save` and `RequestUpdate` describe a planned call only. `App.updateSummary` is unused. No user-save round trip can be traced; the existing read path is independent. |
| CSV | Direct `GET /api/requests/export` -> all requests, municipality order -> [CsvExporter.Export/Escape](../api/CsvExporter.cs) -> `Results.File`, `requests.csv`. No UI export caller. Preserve the two columns defined in the [contract](api-contract.md#api-endpoints), UTF-8 without BOM, CRLF, quoting and formula neutralization. |
| Startup/persistence | [Program](../api/Program.cs) registers Npgsql, creates the schema and calls `SeedData.EnsureSeededAsync`. [WorkshopDb](../api/WorkshopDb.cs) maps requests/activity, cascade delete and status/version concurrency tokens. The existing application `SaveChangesAsync` call is in seeding. |

## Dependencies and integrations

- Package dependencies: [web/package.json](../web/package.json) declares React/React DOM and TypeScript/Vite tooling; [API project](../api/Workshop.Api.csproj) targets .NET 10 and references Npgsql EF Core. Package references do not establish remote service integrations.
- External runtime dependency: PostgreSQL through `Program.UseNpgsql` and the configured `Workshop` connection. No external identity, municipal API, messaging or document-store integration is evidenced in these application paths.
- Diagnostics: `Program` adds `X-Correlation-ID` and logs request metadata; [WorkshopExceptionHandler](../api/WorkshopExceptionHandler.cs) maps concurrency exceptions to 409. This is not an implemented Reviewed-edit guard.
- Tests: [ApiFactory](../tests/ApiFactory.cs) substitutes SQLite; [App.test.tsx](../web/src/App.test.tsx) mocks the client. [ApiTests](../tests/ApiTests.cs) characterizes HTTP export; [CsvTests](../tests/CsvTests.cs) covers format/escaping. SQLite and mocked tests do not verify live PostgreSQL or browser integration.

## Optional status-filter impact

This is a proposed change boundary, not an implemented feature or agreed query policy.

| Surface | Impact |
| --- | --- |
| Endpoint and contract | List query in `Endpoints` plus [API contract](api-contract.md). Use existing status definitions; keep response DTOs, schema and omitted-query behavior. Decide invalid, empty, repeated and case-variant input semantics first. |
| Known callers | `api.list`, `App` mount effect, `ApiTests` direct GET and frontend mocks. Optional client arguments can preserve existing callers. UI selection, reload races, search subset, counts and empty states matter only if UI filtering is requested. |
| Tests | Mixed-status API fixtures, omitted filter, each status, no matches, ordering and agreed invalid inputs. UI/client tests only for requested wiring. Current seeds contain only New requests. |
| CSV | Separate export query remains export-all with the same two columns. Do not reuse a filtered list implicitly. Retain exporter tests and HTTP characterization. |
| Unknown consumers | External scripts, deployed clients and CSV readers are not discoverable here. Preserve no-query compatibility; filtered export requires a separate decision. |

## Limits

Deployment asset packaging, live PostgreSQL, fresh installation and browser behavior
remain unverified. See [evidence](evidence.md) for actual checks and
[rule catalogue](rule-catalogue.md#open-questions-and-contradictions) for domain uncertainties.
