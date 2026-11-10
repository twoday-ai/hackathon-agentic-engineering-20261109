# Loop lab: from a prompt to proof

A runnable, deliberately broken checkout calculator for teaching **Prompt -> Context -> Harness -> Loop -> Graph**, with evaluation and governance underneath. ASP.NET Core / C# on **.NET 10**, React / TypeScript on Vite. No model API, fake agent progress, authentication, database, or cloud services.

**The delivered default is the BUGGY STARTER.** It compiles, and the frontend checks pass, but the backend acceptance suite is intentionally red. A human presenter runs a coding agent against real tests. The UI never repairs or substitutes the API's answer.

The app itself focuses only on the checkout calculator, pricing rules, and order summary. Engineering theory and presenter guidance stay in this README, not in the interface.

## Prerequisites and installation

Use Windows PowerShell 5.1+ or PowerShell 7, a stable **.NET 10 SDK** with ASP.NET Core 10 runtime, and **Node.js 22.12+ (22.x) or 24+** with npm. `global.json` selects .NET 10 only. Scripts do not install OS-wide software or change execution policy.

```powershell
Set-Location C:\Temp\L1
dotnet --version
node --version
.\scripts\Install-Demo.ps1
```

Dependencies restore locally using the included npm and NuGet lock files. Initial installation needs internet access to npm and NuGet. If organizational PowerShell policy blocks scripts, use an approved terminal/policy; do not bypass it blindly.

## Run (two visible terminals)

Terminal 1:

```powershell
Set-Location C:\Temp\L1
.\scripts\Start-Api.ps1
```

Terminal 2:

```powershell
Set-Location C:\Temp\L1
.\scripts\Start-Web.ps1
```

Open **http://127.0.0.1:5173**. The API listens on **http://127.0.0.1:5080**, health at `/api/health`. Vite proxies `/api` to the backend: no CORS or public binding is needed. Both servers are loopback-only; port conflicts fail visibly rather than moving to another port. Ctrl+C stops each server. API watch reloads source changes; recalculate after the terminal reports reload complete. If an edit needs a restart, stop/start the API before evaluating it.

Light/dark follows the browser initially; a mode button changes it. `?scoutTheme=light` and `?scoutTheme=dark` force the initial theme.

## Pricing contract (immutable)

- JSON input: `subtotalCents`, an integer **0..100000000**; `discountPercent`, a whole integer **0..100**. Both properties are required. Fractional percentages/cents, strings, out-of-range values, missing fields, and malformed JSON are rejected.
- Calculate the percentage discount using decimal arithmetic, then **round the discount amount to the nearest integer cent; exact half cents round away from zero** (up for these nonnegative values). Subtract that rounded discount from the original subtotal. Example: 5 cents at 10% gives 1 cent discount, 4 cents discounted subtotal.
- Charge **500 cents** shipping unless the **discounted subtotal is at least 10000 cents**, in which case shipping is zero.
- Total = discounted subtotal + shipping. All monetary API fields are integer cents. USD formatting is presentation only. Per this deliberately small contract, a zero-value basket still costs 500 cents shipping.

| Immutable case | Discount | Discounted subtotal | Shipping | Total |
|---|---:|---:|---:|---:|
| 10000 cents / 10% | 1000 | 9000 | **500** | **9500** |
| 12000 cents / 10% | 1200 | 10800 | **0** | **10800** |

The starter incorrectly checks shipping eligibility against the **pre-discount subtotal**. Its first-case response is discounted subtotal 9000, shipping **0**, total **9000**. Everything else should remain correct.

Example real request:

```powershell
Invoke-RestMethod http://127.0.0.1:5080/api/checkout -Method Post `
  -ContentType 'application/json' `
  -Body '{"subtotalCents":10000,"discountPercent":10}'
```

## Real checks

Run this in a third visible terminal. It checks immutable-file hashes, type-checks/builds React, runs frontend checks, and executes .NET unit and in-process HTTP acceptance tests. It prints real runner output and **returns nonzero on any failure**; it never converts expected failures into a green gate.

```powershell
Set-Location C:\Temp\L1
.\scripts\Test-Demo.ps1
```

Individual commands, for diagnosis:

```powershell
dotnet test .\tests\Checkout.Tests\Checkout.Tests.csproj --logger "console;verbosity=normal"
Push-Location .\frontend
npm run build
npm test
Pop-Location
```

**Expected starter failures (three):**

| Check | Input | Required vs starter |
|---|---|---|
| `PricingTests.ImmutableAcceptanceCases` | 10000 / 10% | Shipping 500 vs 0; total 9500 vs 9000 |
| `PricingTests.ShippingBoundaryUsesDiscountedSubtotal` | 11110 / 10% | Discounted 9999; shipping 500 vs 0 |
| `ApiTests.ImmutableHttpAcceptanceCases` | 10000 / 10% | HTTP response shipping 500 vs 0; total 9500 vs 9000 |

The second central case, exact post-discount boundary (11111 / 10% -> 10000), just-above boundary, no-discount cases, rounding, input validation, health, and frontend tests must pass. Setup, type/build, validation, connection, or other failures are **not** part of the seeded exercise.

`demo\acceptance-lock.json` guards the test source files and test configuration against accidental edits. This is a local teaching guardrail, not a security boundary: do not edit the manifest to approve changed tests. Keep original tests, test setup, project references, and the harness immutable during repair.

## Presenter walkthrough (6 minutes)

| Time | Show / say |
|---|---|
| 0:00-0:45 / Prompt | Open the app. "Make checkout correct" is not a success criterion. Click **Threshold trap**: the API really returns $90.00, not the contracted $95.00. The rule comparison calls out the missing $5.00. |
| 0:45-1:30 / Context | Read the pricing contract and two acceptance cases. Explain integer cents and the rounding policy. Click **Still qualifies** ($108.00) and **Exact boundary** ($100.00). One passing example does not prove correctness. |
| 1:30-2:15 / Harness | Run `.\scripts\Test-Demo.ps1` in the visible terminal. Three failures pinpoint the same rule across unit, boundary, and HTTP checks. Hash guards, tests, and exit codes are the evidence, not the agent's confidence. |
| 2:15-4:15 / Loop | Paste the prompt below into a fresh coding-agent session rooted at `C:\Temp\L1`. Watch **Act -> Observe -> Evaluate -> Adjust** in real code and real runner output. The presenter can approve source edits; the agent cannot change the acceptance contract. Count attempts. |
| 4:15-5:15 / Verify | Require a final full green harness run. Wait for API reload and click **Threshold trap** again: now $95.00, shipping $5.00. Check **Still qualifies** still returns $108.00. If no progress or budget exhausted, stop and escalate instead of claiming success. |
| 5:15-6:00 / Graph + governance | Draw the decision graph below: inspect -> edit -> verify; green -> stop; improved but red -> loop; no progress / third attempt -> human. Explain evaluation lives at every gate and the same graph generalizes to larger workflows. No agent platform is running behind this page. |

Teaching graph (not a simulated runtime):

```text
Prompt -> Context -> Harness -> Act -> Observe -> Evaluate
                                  ^               |
                                  |     +---------+----------+
                                  |     |         |          |
                                  |   all pass  progress   no progress,
                                  |     |       & <3 edits  blocked, or 3 edits
                                  |    STOP       |          |
                                  +---- Adjust <--+       ESCALATE

               Evaluation + governance across every gate
```

## Copy-paste coding-agent prompt

Start a fresh agent in this folder. Do not paste a prior agent's repair or this implementation session's history. There is no saved solution source in this project; `demo\seed` contains only the buggy starter.

```text
Repair the checkout shipping business rule in C:\Temp\L1.

Read README.md's pricing contract and the existing acceptance tests. Work on
the application source, not a simulation. The backend is .NET 10 / C# and the
frontend is React / TypeScript. Keep the scope to the pricing defect.

Immutable acceptance:
10000 cents at 10% -> discount 1000, discounted subtotal 9000,
shipping 500, total 9500.
12000 cents at 10% -> discount 1200, discounted subtotal 10800,
shipping 0, total 10800.
Discount is rounded to integer cents, nearest with half cents away from zero.
Shipping is 500 unless the discounted subtotal is at least 10000.
Keep validation, integer cents, and other existing behavior intact.

Do not edit tests, test setup/configuration, package/project files, scripts,
demo files, acceptance-lock.json, or this contract. Do not skip tests, relax
assertions, rebaseline hashes, replace API values in the UI, or hardcode the
examples. Do not read .demo-backups or use a saved solution. No model APIs,
new dependencies, git initialization, or commits.

First run .\scripts\Test-Demo.ps1 and observe the actual baseline. Then use
Act -> Observe -> Evaluate -> Adjust. At most THREE source-repair attempts;
one edit batch followed by a verification run counts as one attempt.
For each attempt, state the hypothesis, make a minimal source change, run
.\scripts\Test-Demo.ps1 visibly, and report the real failures and exit code.

Stop immediately when the complete harness passes. Confirm the live API's
two acceptance responses and stop. If it is not running, start it locally
using the documented command for verification and state its lifetime.
If an attempt makes no measurable progress, stop instead of repeating it.
If blocked or still red after three attempts, do not claim success:
escalate to the human with observed failure, attempts made, and next decision.
Progress means fewer failing checks with no new failures, never rewritten
checks or merely a confident explanation.
```

## Reset ONLY the seeded pricing implementation

Stop the coding agent first. Review the current pricing source. The reset requires **an explicit switch and the reviewed file's SHA256**, refuses a changed or linked target, verifies its seed, and saves the previous file under `.demo-backups` before replacing **only** `backend\Checkout.Api\PricingCalculator.cs`. It never touches tests, UI, unrelated source, or git. Do not reset while another editor/agent is writing the file.

```powershell
Set-Location C:\Temp\L1
Get-Content .\backend\Checkout.Api\PricingCalculator.cs
$reviewedHash = (Get-FileHash .\backend\Checkout.Api\PricingCalculator.cs -Algorithm SHA256).Hash
.\scripts\Reset-Starter.ps1 -ExpectedCurrentHash $reviewedHash -ConfirmReset
.\scripts\Test-Demo.ps1
```

The harness should again report exactly the three documented failures. Recalculate in the browser after the API reloads. If already seeded, reset is a no-op. Without `-ConfirmReset`, with a stale hash, or with a modified seed it refuses to overwrite anything. The printed backup is for the human's recovery only; it is not context for the live repair agent. Backups are never automatically deleted.

## Small project map

```text
backend\Checkout.Api\        minimal HTTP API, input validation, pricing source
tests\Checkout.Tests\        immutable C# unit and real HTTP pipeline tests
frontend\src\               React UI, typed fetch client, frontend tests
scripts\                    install, run, observable checks, narrow reset
demo\acceptance-lock.json    immutable check fingerprints
demo\seed\                  buggy implementation only
```

There is deliberately no automatically loaded agent instruction file containing a repair. The presenter prompt sets the context and repair budget explicitly.
