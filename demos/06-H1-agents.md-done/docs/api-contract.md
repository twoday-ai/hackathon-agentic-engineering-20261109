# How the browser talks to the API

This is a technical reference for you and Codex. The browser sends a call to an endpoint: an API address that does a particular job. JSON is the text format used to exchange the information. Property names use camelCase, such as `projectTitle`.

## API endpoints

| Available | Action | Endpoint | Result |
| --- | --- | --- | --- |
| Available | Check the app/database connection | GET `/api/health` | `{status:"ok", database:true}` |
| Available | Download the existing export | GET `/api/requests/export` | CSV with Municipality and Project title |
| Available | Get the list | GET `/api/requests` | A list of `{id, municipality, projectTitle, status}` |
| Available | Open one request | GET `/api/requests/{id}` | Its details, described below |
| Planned | Check what is missing | POST `/api/requests/{id}/check` | `{isReady, missingFields:string[]}` |
| Planned | Save the four editable fields | PUT `/api/requests/{id}` | Updated details; incomplete drafts may be saved |
| Planned | Mark a complete request Reviewed | POST `/api/requests/{id}/review` | Updated details and activity |

`{id}` stands for the selected request's ID. GET reads information, PUT saves an update, and POST asks the server to perform an action.

## Request details

The detail response contains `{id, municipality, projectTitle, description, budgetAttached, status, readiness, activity}`. Status is `"New"` or `"Reviewed"`. Readiness is null until the information checks are implemented. Activity is empty until review recording is implemented.

To save, send `{municipality, projectTitle, description, budgetAttached}`. A review activity contains `action`, `actor`, `occurredAt` (ISO date/time), and `correlationId`.

## Errors and repeated actions

- Unknown request: HTTP 404, meaning “not found”.
- Review with missing required information: HTTP 400, meaning the action is invalid.
- Editing a Reviewed request: HTTP 409, meaning the update conflicts with its current state.
- Reviewing a request again returns the current request and does not add another activity.

Errors include a readable message. The `X-Correlation-ID` response header connects the API call with its server log messages. The app has one fictional development caseworker; it has no sign-in or permission system.
