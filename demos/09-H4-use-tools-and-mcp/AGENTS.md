# Project guidance

## Orientation

Request Workbench uses ASP.NET Core/.NET 10, EF Core with PostgreSQL,
and React 19/TypeScript with Vite.

- `api/`: endpoints, contracts, persistence, readiness and CSV helpers.
- `web/src/`: UI, API client, TypeScript types and frontend tests.
- `tests/`: xUnit API and CSV tests; API tests use in-memory SQLite.
- `docs/`: business rules, API contract and development evidence.
- `.agents/skills/` and `.codex/`: project skills and agent configuration.

Implemented behavior includes request list/detail, local search, health
and CSV export. Check/save/review endpoints remain planned; readiness
evaluation currently returns null. Client methods do not prove server
implementation.

## Authoritative references

Read `docs/rules.md` and `docs/api-contract.md` before proposing changes.
Use `README.md` for documented setup and `docs/evidence.md` for prior
decisions and check results. Inspect source and run checks to establish
current behavior; documentation is not runtime evidence.

## Boundaries and conventions

Implement only the requested scope. Ask when behavior is unclear and
state uncertainty explicitly. Preserve the four editable fields, three
readiness rules and two saved statuses defined in `docs/rules.md`.
Do not add business fields, services, authentication or uploads without
a request.

Reuse existing components, API types and helpers. Keep JSON camelCase,
TypeScript strict and C# nullable checks enabled. Use sentence-style
capitalization.

Use business language throughout the product UI, including accessibility
text, messages and activity. Never expose hackathon, workshop, training
case, exercise, task, build-session, checkpoint, demo, participant, Codex
or implementation instructions in user-facing content.

Use one code writer at a time. Use only tools and definitions actually
available. Do not launch local MCP servers or expose credentials.
Optional remote GitHub access requires approval; role instructions grant
no additional permissions.

## Verified checks

Run in this order:

1. Root: `dotnet test Workshop.slnx`
2. `web/`: `npm test`
3. `web/`: `npm run build`

Record useful decisions, actual results, checks not run and unresolved
issues in `docs/evidence.md`; preserve earlier entries. Human review
is required before accepting changes.

## Setup documented but not verified here

`global.json` requests SDK 10.0.100 with latestFeature roll-forward;
`web/package.json` requires Node >=22.12. Verification used .NET SDK
10.0.303, Node 24.18.0 and npm 11.16.0 with existing dependencies.

README setup uses PostgreSQL, `ConnectionStrings__Workshop`,
`dotnet restore Workshop.slnx`, and `npm ci` in `web/`. It documents
`dotnet run --project api --no-launch-profile --urls http://127.0.0.1:5080`
and `npm run dev` in `web/`.

Fresh installation, live PostgreSQL, development startup and browser
checks were not verified. Passing SQLite tests does not verify PostgreSQL.
