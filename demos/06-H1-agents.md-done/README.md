# Request Workbench

A local request-tracking application. Each request contains a municipality name, project title, optional description, budget flag, and New or Reviewed status. The server checks whether the required information is present before review. Reviewed requests are read-only.

## Project structure

| Folder | Contents |
| --- | --- |
| `api` | ASP.NET Core API and PostgreSQL persistence |
| `web` | React and TypeScript frontend |
| `tests` | API and CSV tests |
| `docs` | Business rules, API contract, and development notes |
| `.agents` and `.codex` | Project-specific agent guidance and tool configuration |

## Run locally

Use .NET 10, Node.js 22.12 or newer, and a running PostgreSQL database. Restore the backend with `dotnet restore Workshop.slnx`. In `web/`, use `npm install` initially, or `npm ci` when a lockfile exists.

Set `ConnectionStrings__Workshop` in the API terminal to your local database connection. The default in `api/appsettings.json` uses `localhost:5432`, database `request_workshop`, and the local training credentials. The API creates its fixed schema and sample records in an empty database.

Start the API from the project root:

```powershell
dotnet run --project api --no-launch-profile --urls http://127.0.0.1:5080
```

In a second terminal, from `web/`, run `npm run dev`. Open http://127.0.0.1:5173. Stop each process with Ctrl+C. Keep the same database connection to retain saved data.

## Checks

Run `dotnet test Workshop.slnx` from the project root. In `web/`, run `npm test` and `npm run build`.

See [business rules](docs/rules.md), [API contract](docs/api-contract.md), and [development notes](docs/evidence.md).
