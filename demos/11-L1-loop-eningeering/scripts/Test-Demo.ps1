$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    $lock = Get-Content .\demo\acceptance-lock.json -Raw | ConvertFrom-Json
    foreach ($entry in $lock.files) {
        $actual = (Get-FileHash -LiteralPath (Join-Path $root $entry.path) -Algorithm SHA256).Hash
        if ($actual -ne $entry.sha256) {
            throw "IMMUTABLE CHECK CHANGED: $($entry.path). Restore the original check; do not rebaseline the lock."
        }
    }
    Write-Host 'Immutable checks: unchanged.' -ForegroundColor Green
    Write-Host 'The starter is intentionally red. Only pricing-rule assertion failures are expected.'
    $failures = 0

    Push-Location .\frontend
    try {
        & npm run build
        if ($LASTEXITCODE -ne 0) { $failures++ }
        & npm test
        if ($LASTEXITCODE -ne 0) { $failures++ }
    } finally { Pop-Location }

    & dotnet test .\tests\Checkout.Tests\Checkout.Tests.csproj --nologo --logger 'console;verbosity=normal'
    if ($LASTEXITCODE -ne 0) { $failures++ }
    if ($failures -ne 0) {
        Write-Host "`nCHECKS FAILED ($failures command groups). Do not declare success. Inspect the real failures above." -ForegroundColor Red
        exit 1
    }
    Write-Host "`nALL CHECKS PASSED. Stop the repair loop." -ForegroundColor Green
} finally { Pop-Location }
