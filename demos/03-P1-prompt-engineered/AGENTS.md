# Project guidance

Implement the task provided in the current request. Read `docs/rules.md` and `docs/api-contract.md` before proposing changes. Ask for clarification when the requested behavior is unclear.

The application uses .NET 10/C#, React/TypeScript, and PostgreSQL. Server code is in `api/`, browser code in `web/src/`, and tests in `tests/` and `web/src/`. Use the existing components and API types. Keep changes within the agreed project scope; do not add business fields, services, or authentication without a request.

Use one code writer at a time. Run `dotnet test Workshop.slnx` at the project root, then `npm test` and `npm run build` in `web/`. Report actual outcomes and anything not run. Record useful development decisions and check results in `docs/evidence.md`. A human reviews the changes before accepting them.

Available custom agents: workshop_analyst, workshop_implementer.
Available skills: frame-task, implement-slice, map-context.

Use only definitions that exist. Microsoft Learn and OpenAI Docs MCP provide remote reference tools; optional remote GitHub requires approved access. Read local business rules directly. Documentation is not runtime evidence. Do not launch an MCP server locally or expose credentials. Role instructions do not grant extra permissions.

## Product UI

Treat Request Workbench as a real business application. User-facing UI must never mention the hackathon, workshop, training case, exercises, tasks, build sessions, checkpoints, demos, participants, Codex, or implementation instructions. This applies to headings, page titles, labels, help text, empty/loading/error states, footers, accessibility text, and activity data. Use business language only. Keep all learning instructions in the accompanying documentation, outside the application UI.
