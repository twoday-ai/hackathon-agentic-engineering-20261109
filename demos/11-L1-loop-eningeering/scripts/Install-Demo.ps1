$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    & dotnet --version
    if ($LASTEXITCODE -ne 0) { throw 'A stable .NET 10 SDK is required. No SDK has been installed by this script.' }
    $sdk = & dotnet --version
    if ($sdk -notmatch '^10\.') { throw 'This demo requires .NET 10; it must not be downgraded.' }
    $node = & node --version
    if ($LASTEXITCODE -ne 0) { throw 'Node.js 22.12+ (22.x) or 24+ is required.' }
    $nodeVersion = [version]($node.TrimStart('v'))
    if (-not (($nodeVersion.Major -eq 22 -and $nodeVersion.Minor -ge 12) -or $nodeVersion.Major -ge 24)) {
        throw "Unsupported Node.js $node. Use Node.js 22.12+ (22.x) or 24+."
    }

    & dotnet restore .\tests\Checkout.Tests\Checkout.Tests.csproj --locked-mode --nologo
    if ($LASTEXITCODE -ne 0) { throw 'Backend restore failed. See the terminal output above.' }
    Push-Location .\frontend
    try {
        & npm ci --no-fund --no-audit
        if ($LASTEXITCODE -ne 0) { throw 'Frontend restore failed. See the terminal output above.' }
    } finally { Pop-Location }
    Write-Host "`nDependencies ready. Run Start-Api.ps1 and Start-Web.ps1 in separate terminals."
} finally { Pop-Location }
