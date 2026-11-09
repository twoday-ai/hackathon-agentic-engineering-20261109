# Development notes

Record decisions and actual check results for each change. Include the requested behavior, relevant files or references, changed behavior, command results, unresolved issues, and review decision. Preserve earlier notes and keep credentials out of this file.

## 2026-11-07: Product-facing UI

Replaced training branding, instructions and footers with Request Workbench business copy across the starter and all checkpoints. Service messages use user-facing language. New activity uses Request officer; response mapping also normalizes the previous actor label for existing records. Added the product UI constraint to project guidance.

Validation: archive integrity, matching application source across all packages (including nested copies), and UI text checks passed for all seven stages. Runtime verification could not complete: npm dependencies were unavailable locally and registry.npmjs.org failed DNS resolution; npm test and npm run build could not find vitest/tsc. The starter dotnet test attempt returned no test result; the no-restore attempt exited 1 without diagnostics. Remaining stages were not runtime-tested. Human review pending.

## 2026-11-07: Usable request workspace from startup

Promoted the existing checkpoint-01 list/detail UI, API endpoints and selection tests into start-here and checkpoint 00. Retained the database seed and existing contracts. Updated Build 1 and presenter wording to treat list/detail as supplied functionality. Empty-list text no longer appears when loading failed. Package consistency checks passed; runtime verification remains outstanding in this environment.

## 2026-11-08: Request list search

Added search in `web/src/App.tsx` with layout in `web/src/styles.css`. Search trims the query and matches case-insensitive substrings in the loaded municipality and project title values. Accented letters keep their distinctions. Filtering preserves list order and keeps an open request in view with a notice when its row is hidden. Clearing restores the list and returns focus to search. Search makes no API calls. Regression tests in `web/src/App.test.tsx` cover both fields, no matches, empty and error states, and clearing with a hidden selection.

Verification: `dotnet test Workshop.slnx` passed 6 tests and reported NU1903 for the existing `SQLitePCLRaw.lib.e_sqlite3` 2.1.11 dependency. `npm test` passed 5 tests and `npm run build` passed. The initial sandboxed .NET run exited without a test result, and the frontend checks needed the existing locked dependencies, which installed successfully after the sandboxed registry lookup failed. Human review pending.

## 2026-11-08 · Search result count

`web/src/App.tsx` shows a count above the results when an active search returns matches. It uses the existing muted status style and counts the locally filtered rows. The no-match message and API contract are unchanged. The existing search test in `web/src/App.test.tsx` now checks singular and plural wording and confirms the count disappears for a whitespace-only query.

`dotnet test Workshop.slnx` passed 6 tests and reported NU1903 for the existing `SQLitePCLRaw.lib.e_sqlite3` 2.1.11 dependency. `npm test` passed 5 tests. `npm run build` passed. Human review pending.

The follow-up clarified the exact zero-result label, “No matching requests”. Updated only that label and its test assertions. The same checks passed on rerun (6 .NET tests, 5 frontend tests, and the production build), with the same NU1903 warning. Human review pending.

## 2026-11-09: Instructor documentation research

After design review and the user's instruction to implement, created `.codex/agents/documentation-researcher.toml` and `.agents/skills/source-research/SKILL.md`. The role owns instructor documentation verification and avoids file edits; the skill defines the reusable source-verification procedure. No application source was edited. Parent permissions and MCP configuration were unchanged.

Validation: the skill-creator `quick_validate.py` returned `Skill is valid!`; Python `tomllib` parsed the agent file and verified its required string fields. Required checks ran in order: `dotnet test Workshop.slnx` passed 6 tests with the existing NU1903 warning for `SQLitePCLRaw.lib.e_sqlite3` 2.1.11; `npm test` in `web/` passed 5 tests; `npm run build` in `web/` passed.

Delegation using `agent_type = documentation-researcher` failed with `unknown agent_type 'documentation-researcher'`. Disclosed that failure and delegated to an available default subagent with the exact role instructions and explicit `$source-research` file path. This validates use of the procedure, not discovery/loading of the new custom role. Installed client-version compatibility and whether a new session will load the role remain unverified.

The delegated researcher successfully searched official OpenAI documentation and fetched the supporting sections; no research calls were blocked. Current guidance states that do-not-edit instructions do not create a separate read-only sandbox. Subagents inherit parent permissions; custom-agent `sandbox_mode` and `approval_policy` cannot override them. For the workshop reviewer, retain the behavioral no-edit instruction and use parent read-only permissions when enforcement is required. Sources: https://learn.chatgpt.com/docs/agent-configuration/subagents#approvals-and-sandbox-controls and https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agent-file-schema . No sandbox enforcement experiment or live PostgreSQL/browser checks were run. Human review of the resulting files remains pending.
