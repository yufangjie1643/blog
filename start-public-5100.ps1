$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 5100
$PublicUrl = "http://ssh.txyyfj.top:$Port/"

Set-Location $ProjectRoot

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $listeners) {
  if (-not $processId -or $processId -eq $PID) {
    continue
  }

  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
  if ($process) {
    Write-Host "Stopping existing listener on port ${Port}: PID $processId ($($process.ProcessName))"
    Stop-Process -Id $processId -Force
  }
}

Write-Host "Starting owner_blog on [::]:$Port"
Write-Host "Public URL: $PublicUrl"
Write-Host "Local URL:  http://localhost:$Port/"
Write-Host ""

npm run dev
