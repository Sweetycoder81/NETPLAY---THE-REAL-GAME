# NETPLAY - One-command commit + push
# Usage:
#   ./push.ps1
#   ./push.ps1 "feat: message"

param(
  [Parameter(Mandatory=$false)]
  [string]$Message = "chore: update"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not available in PATH. Install Git and restart terminal."
}

Write-Host "[NETPLAY] Status" -ForegroundColor Cyan
git status --porcelain

Write-Host "[NETPLAY] Adding changes..." -ForegroundColor Cyan
git add -A

$diff = git diff --cached --name-only
if (-not $diff) {
  Write-Host "[NETPLAY] Nothing to commit." -ForegroundColor Yellow
  exit 0
}

Write-Host "[NETPLAY] Committing..." -ForegroundColor Cyan
git commit -m $Message

Write-Host "[NETPLAY] Pushing..." -ForegroundColor Cyan
git push

Write-Host "[NETPLAY] Done ✅" -ForegroundColor Green
