# Development notes

Record decisions and actual check results for each change. Include the requested behavior, relevant files or references, changed behavior, command results, unresolved issues, and review decision. Preserve earlier notes and keep credentials out of this file.

## 2026-11-07: Product-facing UI

Replaced training branding, instructions and footers with Request Workbench business copy across the starter and all checkpoints. Service messages use user-facing language. New activity uses Request officer; response mapping also normalizes the previous actor label for existing records. Added the product UI constraint to project guidance.

Validation: archive integrity, matching application source across all packages (including nested copies), and UI text checks passed for all seven stages. Runtime verification could not complete: npm dependencies were unavailable locally and registry.npmjs.org failed DNS resolution; npm test and npm run build could not find vitest/tsc. The starter dotnet test attempt returned no test result; the no-restore attempt exited 1 without diagnostics. Remaining stages were not runtime-tested. Human review pending.

## 2026-11-07: Usable request workspace from startup

Promoted the existing checkpoint-01 list/detail UI, API endpoints and selection tests into start-here and checkpoint 00. Retained the database seed and existing contracts. Updated Build 1 and presenter wording to treat list/detail as supplied functionality. Empty-list text no longer appears when loading failed. Package consistency checks passed; runtime verification remains outstanding in this environment.
