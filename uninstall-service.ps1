$ErrorActionPreference = 'Stop'

$ServiceName = 'OwnerBlog5100'

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Administrator rights are required. Run uninstall-service.bat, or run this script from an elevated PowerShell window.'
}

$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $existing) {
  Write-Host "Service is not installed: $ServiceName"
  exit 0
}

Write-Host "Stopping service: $ServiceName"
Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Deleting service: $ServiceName"
& sc.exe delete $ServiceName | Out-Host
