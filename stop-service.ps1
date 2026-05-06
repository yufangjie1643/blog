$ErrorActionPreference = 'Stop'

$ServiceName = 'OwnerBlog5100'

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Administrator rights are required. Run stop-service.bat, or run this script from an elevated PowerShell window.'
}

$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $existing) {
  Write-Host "Service is not installed: $ServiceName"
  exit 0
}

if ($existing.Status -eq 'Stopped') {
  Write-Host "Service is already stopped: $ServiceName"
} else {
  Write-Host "Stopping service: $ServiceName"
  Stop-Service -Name $ServiceName -Force
  Start-Sleep -Seconds 2
}

Get-Service -Name $ServiceName | Format-Table -AutoSize
