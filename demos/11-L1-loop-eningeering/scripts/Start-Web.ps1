$ErrorActionPreference = 'Stop'
Push-Location (Join-Path (Split-Path $PSScriptRoot -Parent) 'frontend')
try {
    Write-Host 'Browser: http://127.0.0.1:5173 (Ctrl+C to stop)'
    & npm run dev
    if ($LASTEXITCODE -ne 0) { throw 'Frontend stopped with an error. Read the terminal output above.' }
} finally { Pop-Location }
