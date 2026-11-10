param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Fa-f0-9]{64}$')]
    [string] $ExpectedCurrentHash,
    [switch] $ConfirmReset
)

$ErrorActionPreference = 'Stop'
if (-not $ConfirmReset) {
    throw 'No files changed. Review the current pricing source, then explicitly pass -ConfirmReset with its SHA256.'
}
$root = Split-Path $PSScriptRoot -Parent
$target = Join-Path $root 'backend\Checkout.Api\PricingCalculator.cs'
$seed = Join-Path $root 'demo\seed\PricingCalculator.cs.txt'
$seedHash = '7658316A0C116D95BAA56983FC349076A9266F76813D6C0797DF6DCF72D992C7'
if ((Get-FileHash -LiteralPath $seed -Algorithm SHA256).Hash -ne $seedHash) {
    throw 'The seed template changed. Refusing to restore an unverified template.'
}
if ((Get-Item -LiteralPath $target).Attributes -band [IO.FileAttributes]::ReparsePoint) {
    throw 'The pricing source is a link. Refusing to overwrite it.'
}
$before = [IO.File]::ReadAllBytes($target)
$sha = [Security.Cryptography.SHA256]::Create()
try {
    $actual = [BitConverter]::ToString($sha.ComputeHash($before)).Replace('-', '')
} finally { $sha.Dispose() }
if ($actual -ne $ExpectedCurrentHash) {
    throw 'Pricing source changed since review. No files written. Review it and obtain a fresh hash.'
}
if ($actual -eq $seedHash) {
    Write-Host 'Already the seeded starter. No files changed.'
    return
}
$backupFolder = Join-Path $root '.demo-backups'
[IO.Directory]::CreateDirectory($backupFolder) | Out-Null
$backup = Join-Path $backupFolder ("PricingCalculator.{0}.{1}.cs.bak" -f (Get-Date -Format 'yyyyMMdd-HHmmss'), [guid]::NewGuid().ToString('N'))
[IO.File]::WriteAllBytes($backup, $before)
if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $actual) {
    throw "Pricing source changed during reset. Not overwritten. Reviewed bytes preserved at $backup"
}
[IO.File]::WriteAllBytes($target, [IO.File]::ReadAllBytes($seed))
if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $seedHash) {
    throw "Reset verification failed. Prior source preserved at $backup"
}
Write-Host "Restored ONLY: $target"
Write-Host "Prior source preserved at: $backup"
Write-Host 'Starter restored. Test-Demo.ps1 must be red for the documented shipping defect.'
