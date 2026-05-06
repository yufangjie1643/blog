$ErrorActionPreference = 'Stop'

$ServiceName = 'OwnerBlog5100'
$Port = 5100

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Administrator rights are required. Run start-service.bat, or run this script from an elevated PowerShell window.'
}

$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $existing) {
  throw "Service is not installed: $ServiceName. Run install-service.bat first."
}

if ($existing.Status -eq 'Running') {
  Write-Host "Service is already running: $ServiceName"
} else {
  Write-Host "Starting service: $ServiceName"
  Start-Service -Name $ServiceName
  Start-Sleep -Seconds 6
}

Get-Service -Name $ServiceName | Format-Table -AutoSize
try {
  curl.exe --noproxy '*' -I --max-time 10 "http://ssh.txyyfj.top:$Port/"
} catch {
  Write-Warning "Public URL check failed: $($_.Exception.Message)"
}
