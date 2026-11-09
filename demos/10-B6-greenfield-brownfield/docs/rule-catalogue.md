# Rule catalogue

Instructor index of reviewed discovery, 2026-11-09. Policy is canonical in
[rules.md](rules.md) and wire semantics in [api-contract.md](api-contract.md).
Entries below identify policies without replacing those sources.

## Confirmation states

- **Documented**: explicitly stated by a canonical repository source.
- **Observed**: supported by inspected implementation; not a claim of live execution.
- **Covered**: a relevant test asserts the behavior. Execution results belong in [evidence](evidence.md).
- **Owner pending**: no explicit domain-owner confirmation recorded. Reviewed discovery confirms the evidence assessment, not every underlying policy.
- **Unresolved**: inference, missing evidence or an unanswered decision; not a confirmed rule.

## Catalogue

| ID / policy topic | Canonical policy | Implementation evidence | Test coverage | Confirmation |
| --- | --- | --- | --- | --- |
| R1 Municipality readiness | [Readiness rules](rules.md#request-rules), item 1 and whitespace treatment | [Readiness.Evaluate](../api/Readiness.cs) returns null; no check endpoint in [Endpoints](../api/Endpoints.cs) | None for this rule | Documented; owner pending; not implemented |
| R2 Title readiness | Same source, item 2 and whitespace treatment | Same evaluator stub | None for this rule | Documented; owner pending; not implemented |
| R3 Budget readiness / optional description | Same source, item 3 and field semantics | Boolean/string fields in [ProjectRequest](../api/WorkshopDb.cs); evaluator stub | None for validation; UI fixtures are not readiness tests | Documented; representation observed; owner pending |
| R4 Review transition and rejection | [Rules](rules.md#request-rules); [review endpoint and errors](api-contract.md) | No review endpoint/UI. [ActivityRecorder.Reviewed](../api/ActivityRecorder.cs) constructs an entry but has no application caller | None for transition, rejection or persistence | Documented; owner pending; not implemented |
| R5 Repeated review | [Errors and repeated actions](api-contract.md#errors-and-repeated-actions) | No endpoint or duplicate guard; activity helper alone does not enforce this | None, including concurrent retries | Documented; owner pending; not implemented |
| R6 Editable fields / incomplete drafts | [Rules](rules.md#request-rules); [save payload](api-contract.md#request-details) | [RequestUpdate](../api/Contracts.cs) and [api.save](../web/src/api.ts) exist; editor/PUT endpoint absent | None for save/read-back | Documented; payload observed; owner pending; workflow absent |
| R7 Reviewed edit prohibition | [Rules](rules.md#request-rules); [409 policy](api-contract.md#errors-and-repeated-actions) | No update endpoint. [WorkshopExceptionHandler](../api/WorkshopExceptionHandler.cs) handles concurrency exceptions, not status-based edit prohibition | None for status guard | Documented; owner pending; not implemented |
| R8 Status/readiness distinction | [Rules](rules.md#request-rules) | [RequestStatus](../api/WorkshopDb.cs) and [TS union](../web/src/types.ts) match; New is default | No dedicated transition test | Documented; representation observed; owner pending |
| C1 Existing CSV download | [Export contract](api-contract.md#api-endpoints) | [Endpoints](../api/Endpoints.cs) and [CsvExporter](../api/CsvExporter.cs) | `ApiTests.Export_downloads_the_existing_two_column_csv`; existing `CsvTests` | Agreed preservation contract; observed; covered. Not lending policy |

Current [API tests](../tests/ApiTests.cs) otherwise cover health and list/detail/404;
[frontend tests](../web/src/App.test.tsx) cover display, search and errors.
Their passing does not establish R1-R7 enforcement.

## Open questions and contradictions

1. The requested labelled historical note was not located. Obtain its path/text and authority before comparing or adopting it. Dated [development notes](evidence.md) are historical check reports, not proof of current policy enforcement.
2. [README](../README.md) describes checks/read-only behavior in present tense, whereas the [contract](api-contract.md#api-endpoints) marks writes/checks planned and the implementation lacks them. Treat this as documentation overstatement, not permission to alter policy.
3. Domain owner: confirm the documented policy set and resolve what the unidentified historical note supersedes, if anything.
4. Does saving a draft explicitly retain New? This is inferred from the two-status model, not independently confirmed wording.
5. Does repeat-review idempotency cover concurrent calls? What should users observe when edits and review race? Concurrency tokens alone do not answer these questions.

No conflicting policy was found between the two canonical documents. Missing
enforcement is a gap, not evidence that prohibited operations are allowed.
The [fictional scope](rules.md#request-rules) supplies no real lending requirements.
