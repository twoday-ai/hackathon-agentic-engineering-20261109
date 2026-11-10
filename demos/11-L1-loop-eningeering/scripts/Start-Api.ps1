$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    $env:DOTNET_WATCH_SUPPRESS_LAUNCH_BROWSER = '1'
    Write-Host 'API: http://127.0.0.1:5080 (Ctrl+C to stop; source edits trigger reload)'
    & dotnet watch --non-interactive --project .\backend\Checkout.Api\Checkout.Api.csproj run --no-launch-profile --urls http://127.0.0.1:5080
    if ($LASTEXITCODE -ne 0) { throw 'API stopped with an error. Read the terminal output above.' }
} finally { Pop-Location }
