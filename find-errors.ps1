Write-Host "=== FINDING BUILD ERRORS ===" -ForegroundColor Red

# 1. Check TypeScript
Write-Host "`n1. Checking TypeScript..." -ForegroundColor Yellow
try {
    npx tsc --noEmit 2>&1 | Select-String -Pattern "error|Error|ERROR" | ForEach-Object {
        Write-Host "   TS ERROR: $_" -ForegroundColor Red
    }
} catch {
    Write-Host "   Cannot check TypeScript" -ForegroundColor Yellow
}

# 2. Check imports
Write-Host "`n2. Checking imports in game files..." -ForegroundColor Yellow
$gameFiles = @("app/page.tsx", "app/index.tsx")
foreach ($file in $gameFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Check for ../gameEngine
        if ($content -match 'from\s+["'']\.\./gameEngine["'']') {
            Write-Host "   ERROR in $file : Wrong import path" -ForegroundColor Red
        }
        # Check for window without useEffect
        if ($content -match 'window\.(?!addEventListener|removeEventListener)' -and $content -notmatch 'typeof window') {
            Write-Host "   ERROR in $file : window without check" -ForegroundColor Red
        }
    }
}

# 3. Check gameEngine.js exports
Write-Host "`n3. Checking gameEngine.js..." -ForegroundColor Yellow
if (Test-Path "lib/gameEngine.js") {
    $gameEngine = Get-Content "lib/gameEngine.js" -Raw
    if (-not ($gameEngine -match 'export\s+class\s+GameEngine')) {
        Write-Host "   ERROR: GameEngine class not exported" -ForegroundColor Red
    }
    if (-not ($gameEngine -match 'export\s+\{')) {
        Write-Host "   ERROR: No exports found" -ForegroundColor Red
    }
}

# 4. Check for React Native imports in Next.js
Write-Host "`n4. Checking for React Native imports..." -ForegroundColor Yellow
if (Test-Path "app/index.tsx") {
    $indexContent = Get-Content "app/index.tsx" -Raw
    if ($indexContent -match 'react-native') {
        Write-Host "   WARNING: React Native imports found in app/index.tsx" -ForegroundColor Yellow
        Write-Host "   This will break Next.js build!" -ForegroundColor Red
    }
}

Write-Host "`n=== DIAGNOSTIC COMPLETE ===" -ForegroundColor Cyan
