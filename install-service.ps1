$ErrorActionPreference = 'Stop'

$ServiceName = 'OwnerBlog5100'
$DisplayName = 'Owner Blog Astro Dev Server (5100)'
$Port = 5100
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourcePath = Join-Path $ProjectRoot 'service\OwnerBlogService.cs'
$ExePath = Join-Path $ProjectRoot 'OwnerBlogService.exe'

function Assert-Administrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Administrator rights are required. Run install-service.bat, or run this script from an elevated PowerShell window.'
  }
}

function Get-CSharpCompiler {
  $candidates = @(
    "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe",
    "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw 'Cannot find .NET Framework csc.exe.'
}

function Stop-PortListener {
  param([int]$TargetPort)

  $listeners = Get-NetTCPConnection -LocalPort $TargetPort -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $listeners) {
    if (-not $processId -or $processId -eq $PID) {
      continue
    }

    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($process) {
      Write-Host "Stopping existing listener on port ${TargetPort}: PID $processId ($($process.ProcessName))"
      Stop-Process -Id $processId -Force
    }
  }
}

Assert-Administrator
Set-Location $ProjectRoot
New-Item -ItemType Directory -Path (Join-Path $ProjectRoot 'logs') -Force | Out-Null

$csc = Get-CSharpCompiler
Write-Host "Compiling service wrapper: $ExePath"
& $csc /nologo /target:exe /platform:anycpu /out:$ExePath /reference:System.ServiceProcess.dll $SourcePath

$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Stopping existing service: $ServiceName"
  Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2

  Write-Host "Deleting existing service: $ServiceName"
  & sc.exe delete $ServiceName | Out-Host
  Start-Sleep -Seconds 2
}

Stop-PortListener -TargetPort $Port

Write-Host "Registering service: $ServiceName"
New-Service `
  -Name $ServiceName `
  -BinaryPathName "`"$ExePath`"" `
  -DisplayName $DisplayName `
  -StartupType Automatic `
  -Description 'Runs and monitors the owner_blog Astro dev server on ssh.txyyfj.top:5100.'

& sc.exe failure $ServiceName reset= 60 actions= restart/5000/restart/5000/restart/30000 | Out-Host
& sc.exe failureflag $ServiceName 1 | Out-Host

Write-Host "Starting service: $ServiceName"
Start-Service -Name $ServiceName
Start-Sleep -Seconds 6

Get-Service -Name $ServiceName | Format-Table -AutoSize
try {
  curl.exe --noproxy '*' -I --max-time 10 "http://ssh.txyyfj.top:$Port/"
} catch {
  Write-Warning "Public URL check failed: $($_.Exception.Message)"
}
