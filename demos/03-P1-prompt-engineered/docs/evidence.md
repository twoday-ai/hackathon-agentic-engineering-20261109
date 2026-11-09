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
