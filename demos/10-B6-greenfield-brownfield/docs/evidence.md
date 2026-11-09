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

## 2026-11-09: Agent and skill discovery verification

Discovered the configured OpenAI Docs MCP tools from the actual tool catalog, then used `search_openai_docs` and `fetch_openai_doc` to retrieve original official guidance. All documentation calls succeeded; no access was blocked. Sources: https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents , https://learn.chatgpt.com/docs/build-skills#where-to-save-skills , and https://learn.chatgpt.com/docs/config-file/config-advanced#project-config-files-codexconfigtoml .

The documented project locations match `.codex/agents/documentation-researcher.toml` and `.agents/skills/source-research/SKILL.md`. The agent contains the documented required `name`, `description`, and `developer_instructions`; the skill contains `name` and `description` frontmatter. Other project agents and skills use the same respective locations. Project config names the remote OpenAI Docs endpoint and enables agents. Official guidance limits project config loading to trusted projects; the effective trust/config provenance was not independently inspected.

Observed in this session: the collaboration tool advertises `documentation-researcher`, `workshop_analyst`, and `workshop_implementer`; the supplied skill catalog includes all four workspace skills and their paths. Read and applied source-research directly. These observations establish current exposure and file access, not a fresh filesystem discovery trace or successful custom-agent spawn. No subagent was spawned. Preserve the earlier unknown-agent failure as historical evidence; it is not the current advertised tool state.

The shell executable reports `codex-cli 0.164.0-alpha.11.1`; this does not establish the running desktop host/server version. The fetched guidance covers current local app, CLI, and IDE behavior without specifying a minimum compatible release. Both `git rev-parse --show-toplevel` and `git status --short` failed because this workspace is not a Git repository, leaving the documented repository-root skill scan boundary unverified here. No application or configuration changes were made. Application tests/build were not run for this documentation-only verification. Human review pending.

## 2026-11-09: Reusable instructor discovery artifacts

Added linked architecture notes, a rule catalogue with separate documented/observed/covered/owner-confirmation states, and shared architecture/security/domain review responsibilities. AGENTS.md links these indexes to canonical rules and API contracts rather than duplicating policy in each role. Added three review-role TOML definitions using the existing role-file structure; no permissions or MCP settings changed. No application source, canonical business rules, API contract or dependencies changed.

Added one HTTP characterization test, `ApiTests.Export_downloads_the_existing_two_column_csv`, for the agreed existing export contract. It checks successful download, CSV content type/charset, attachment filename and exact UTF-8 bytes (two columns, all three seeded rows in municipality order, CRLF and no BOM). Existing CsvTests continue to cover quoting and formula neutralization. This test uses ApiFactory's SQLite database; it does not verify PostgreSQL.

Required checks ran in order: `dotnet test Workshop.slnx` passed 7 tests, with the existing NU1903 warning for SQLitePCLRaw.lib.e_sqlite3 2.1.11; `npm test` in web/ passed 5 tests; `npm run build` in web/ passed. Review-role TOML and local documentation links were checked separately. No custom role was spawned or its fresh-session loading verified. This workspace is not a Git repository, so the review diff is generated against a pre-edit snapshot rather than Git history.

Unresolved: the labelled historical note remains unidentified; domain-owner confirmation of documented policy is not recorded; draft status wording, concurrent repeat-review guarantees and edit/review races remain questions. README's present-tense workflow claims overstate current implementation. Live PostgreSQL, browser behavior, deployment packaging, fresh installation and external consumers remain unverified. No checks of those environments were run. Human review pending; discovery review is not acceptance of changes or confirmation of every policy.
