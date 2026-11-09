# Development notes

Record decisions and actual check results for each change. Include the requested behavior, relevant files or references, changed behavior, command results, unresolved issues, and review decision. Preserve earlier notes and keep credentials out of this file.

## 2026-11-07: Product-facing UI

Replaced training branding, instructions and footers with Request Workbench business copy across the starter and all checkpoints. Service messages use user-facing language. New activity uses Request officer; response mapping also normalizes the previous actor label for existing records. Added the product UI constraint to project guidance.

Validation: archive integrity, matching application source across all packages (including nested copies), and UI text checks passed for all seven stages. Runtime verification could not complete: npm dependencies were unavailable locally and registry.npmjs.org failed DNS resolution; npm test and npm run build could not find vitest/tsc. The starter dotnet test attempt returned no test result; the no-restore attempt exited 1 without diagnostics. Remaining stages were not runtime-tested. Human review pending.

## 2026-11-07: Usable request workspace from startup

Promoted the existing checkpoint-01 list/detail UI, API endpoints and selection tests into start-here and checkpoint 00. Retained the database seed and existing contracts. Updated Build 1 and presenter wording to treat list/detail as supplied functionality. Empty-list text no longer appears when loading failed. Package consistency checks passed; runtime verification remains outstanding in this environment.

## 2026-11-08: Dark mode

Outcome: caseworkers can choose Light, Dark, or System from the labeled Appearance selector. System is the default; explicit choices are remembered in localStorage. System mode responds to device preference changes. Theme initialization runs before React renders. Storage failures leave the selector usable for the current visit.

Scope and file map: web/src/App.tsx adds the selector, web/src/theme.ts owns preference initialization and updates, web/src/main.tsx initializes the palette, and web/src/styles.css supplies semantic color variables for surfaces, text, selection, forms, focus, status and error states. web/src/theme.test.ts covers theme behavior. No API, persistence model, request fields, readiness rules or statuses changed. The application remains at its supplied list/detail feature scope.

Acceptance examples verified: choosing Dark updates the workspace and survives reload; choosing System follows both dark and light device changes. Existing request selection remains functional. Desktop dark and mobile dark/light screenshots were visually inspected; no horizontal overflow at 390px. Screenshots: dark-mode-desktop.png, dark-mode-mobile.png, light-mode-mobile.png in the project root.

Actual checks:
- dotnet test Workshop.slnx: failed MSB1009 because the solution file is absent from this checkout.
- dotnet test tests/Workshop.Tests.csproj: passed all 6 tests. Restore/build reported existing NU1903 for SQLitePCLRaw.lib.e_sqlite3 2.1.11 (GHSA-2m69-gcr7-jv3q); dependency remediation is outside this change.
- npm test in web: passed 5 tests across 2 files.
- npm run build in web: passed TypeScript validation and Vite production build.
- Browser verification through Playwright with installed Edge: passed selection, reload persistence, live system changes, request details and mobile overflow checks. Request API responses were mocked; no live database integration was exercised in the browser. The initial bundled Chromium attempt could not launch because its executable was absent; Edge provided the successful browser check.

Review: implementation and automated/visual checks complete; human review pending.
