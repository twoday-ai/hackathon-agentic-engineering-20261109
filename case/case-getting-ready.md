# Workshop getting started

Set up Request Workbench before the first build session. Both the step-by-step and open-ended tracks use the same starter project, sample data, and checks. The steps below assume Windows and PowerShell.

## 1. Get the tools and the starter

| Tool | What to have ready |
| --- | --- |
| Git | Access to the workshop repository if you’re cloning it |
| .NET SDK | .NET 10 SDK, version 10.0.100 or a later .NET 10 feature band |
| Node.js and npm | Node.js 22.12 or newer, with npm |
| PostgreSQL | A local Windows installation with the server running and the PostgreSQL command-line tools available |
| VS Code or VS Code Insiders | C# tooling, a PostgreSQL extension if you prefer to run SQL in the editor, and Codex signed in |

From a new PowerShell terminal, check that the tools are available.

```powershell
git --version
dotnet --list-sdks
node --version
npm --version
psql --version
```

If PowerShell cannot find `psql`, find `psql.exe` in the `bin` directory of your PostgreSQL installation. Add that directory to your Windows user `Path`, then reopen PowerShell and VS Code. You can also use your VS Code PostgreSQL extension for the SQL steps below.

Use the supplied checkout or extract the participant package and find `case/start-here`. If you need to clone the workshop repository, run the following commands.

```powershell
git clone https://github.com/twoday-ai/hackathon-agentic-engineering-20261109.git
Set-Location hackathon-agentic-engineering-20261109
```

Open `case/start-here` as your folder in VS Code. You’re in the right place if you can see `Workshop.slnx`, `api/`, `web/`, and `AGENTS.md` together. Keep the whole folder, including `.agents` and `.codex`, so the project’s Codex guidance is available. Open Codex in that workspace and confirm you can use it. For a quick check, ask it to identify the API, UI, and tests in the starter without editing anything. The starter app runs without a model API key or a local MCP server.

## 2. Create the local PostgreSQL database

Start your installed PostgreSQL server. The starter defaults to `localhost:5432`. Connect as the administrator you configured during installation, commonly `postgres`.

```powershell
psql -h localhost -p 5432 -U postgres -d postgres
```

At the `psql` prompt, run the following two statements one at a time. In the VS Code PostgreSQL extension, connect to the `postgres` database and run each statement separately with autocommit enabled.

```sql
CREATE ROLE workshop LOGIN PASSWORD 'workshop-local-only';
CREATE DATABASE request_workshop OWNER workshop;
```

If the role or database already exists, reuse it if it’s your intended local workshop setup and you have its connection details. Run only the statement for anything that’s missing. Use these example credentials for the local fictional data. If you use a different host, port, role, password, or database, use those same values in the connection check and API configuration below.

Exit the administrator session with `\q`, then verify that the application account can connect. For the example role, enter `workshop-local-only` when prompted.

```powershell
psql -h localhost -p 5432 -U workshop -d request_workshop -c "SELECT current_database(), current_user;"
```

You should see `request_workshop` and `workshop`. The API creates the tables and seeds the sample requests when it starts against a fresh workshop database.

## 3. Restore dependencies

Open a terminal at the root of `case/start-here`.

```powershell
dotnet restore Workshop.slnx
Set-Location web
npm install
Set-Location ..
```

If your copy already has `web/package-lock.json`, use `npm ci` in `web` in place of `npm install`.

## 4. Run the API and web app

**Terminal 1** starts the API. Run these commands from `case/start-here`. Replace the example connection string if your local setup differs. Set it in the same terminal where you launch the API.

```powershell
$env:ConnectionStrings__Workshop = 'Host=localhost;Port=5432;Database=request_workshop;Username=workshop;Password=workshop-local-only'
dotnet run --project api --no-launch-profile --urls http://127.0.0.1:5080
```

**Terminal 2** starts the frontend. Start from `case/start-here`.

```powershell
Set-Location web
npm run dev
```

Keep both terminals running. Stop either process with `Ctrl+C` when you’re done. Use the same database connection the next time you run the app to retain your data.

## 5. Verify the baseline

1. Open the [API health endpoint](http://127.0.0.1:5080/api/health) and confirm that it reports `status: ok` and `database: true`.
2. Open [Request Workbench](http://127.0.0.1:5173). With a fresh database, you should see sample requests from Fjordby, Sodal, and Vesteng. Select one and confirm that its read-only details load.
3. In another terminal at `case/start-here`, run the existing checks and record any failures before you make changes.

```powershell
dotnet test Workshop.slnx
Set-Location web
npm test
npm run build
Set-Location ..
```

The existing API tests use an in-memory SQLite database. The health check and the request-list check exercise the running app with your local PostgreSQL connection.

## If you get stuck

| Symptom | What to check |
| --- | --- |
| `dotnet` is available but the solution won’t load | Check `dotnet --list-sdks` against the .NET 10 SDK requested in `global.json`. |
| The database connection is refused | Check that PostgreSQL is running and that the server is listening on the host and port you used. |
| PostgreSQL rejects the password or can’t find the database | Repeat the `psql` connection check as the application role. Compare those values with `ConnectionStrings__Workshop` and restart the API after changing it. |
| The web app starts but the request list fails to load | Check the API health endpoint and API terminal first. The frontend expects the API at `127.0.0.1:5080`. |
| Port `5080` or `5173` is already in use | Check whether an earlier copy of the API or frontend is still running. Stop that copy if it’s yours, or ask the facilitator if another service is using the port. |

## Start your track

Open [workshop-case.md](workshop-case.md). Read the product-owner handover and backlog, then work out what to investigate and what to take on first.

In either track, make your changes in `case/start-here`.
