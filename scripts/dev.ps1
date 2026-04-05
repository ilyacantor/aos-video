# dev.ps1 — Launch Claude Code + Remotion Studio side by side

$projectDir = Split-Path -Parent $PSScriptRoot

# Launch Remotion Studio in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; npx remotion studio --browser chrome"

# Launch Claude Code in this terminal
cd $projectDir
claude --dangerously-skip-permissions --model opus --reasoning-effort max
