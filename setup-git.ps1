# NETPLAY - Git Setup (PowerShell)
# Prereq: Install Git for Windows and restart your terminal so `git` is available.
# Repo: https://github.com/Sweetycoder81/NETPLAY---The-Real-Game.git

$ErrorActionPreference = "Stop"

Write-Host "[NETPLAY] Initializing git repo..." -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not available. Install Git for Windows, restart terminal, then re-run this script."
}

if (-not (Test-Path .git)) {
  git init
}

# Ensure origin remote points to your repo
$remoteUrl = "https://github.com/Sweetycoder81/NETPLAY---The-Real-Game.git"
$existing = (git remote 2>$null)
if ($existing -contains "origin") {
  git remote set-url origin $remoteUrl
} else {
  git remote add origin $remoteUrl
}

# Recommended user identity (edit these if you want)
# git config user.name "Your Name"
# git config user.email "you@example.com"

Write-Host "[NETPLAY] Creating initial commit..." -ForegroundColor Cyan

git add -A

# Commit only if there is something to commit
$diff = git diff --cached --name-only
if (-not $diff) {
  Write-Host "[NETPLAY] Nothing to commit." -ForegroundColor Yellow
} else {
  $subject = "feat(ui): hardcore gaming HUD"
  $body = @"
- Mouse-follow radial gradient background
- Orbitron headings
- Framer Motion hero + scroll shuttlecock
- Glassmorphism 2.0 cards + neon border beam
- Pulse + glitch button effects
"@

  git commit -m $subject -m $body
}

Write-Host "[NETPLAY] Pushing to GitHub..." -ForegroundColor Cyan

# Ensure main branch name
git branch -M main

# If remote already has commits, integrate them before first push
git fetch origin 2>$null | Out-Null
try {
  git pull --rebase --allow-unrelated-histories origin main
} catch {
  # If pull fails (e.g. no remote branch), continue to push attempt
}

# First push (will prompt for auth if needed)
git push -u origin main

Write-Host "[NETPLAY] Done ✅" -ForegroundColor Green
Write-Host "Repo: $remoteUrl" -ForegroundColor Green
