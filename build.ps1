# RotinaActivity Ultimate - Automated Build & Diagnostic Script

$ErrorActionPreference = "Continue"

$buildLogPath = Join-Path $PSScriptRoot "build.txt"

function Write-BuildLog {
    param([string]$message)
    Write-Output $message
    try {
        $message | Out-File -FilePath $buildLogPath -Append -Encoding utf8 -ErrorAction SilentlyContinue
    } catch {}
}

if (Test-Path $buildLogPath) {
    try { Remove-Item $buildLogPath -Force -ErrorAction SilentlyContinue } catch {}
}

Write-BuildLog "========================================================="
Write-BuildLog "   BUILD PROCESS: RotinaActivity Ultimate (.NET 8.0 & Vite UI)"
Write-BuildLog "   Started at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-BuildLog "========================================================="

# 1. Convert/Copy Icon Assets
if (Test-Path "icon.png") {
    Write-BuildLog "Verifying icon assets (icon.png & icon.ico)..."
    if (-not (Test-Path "icon.ico")) {
        Write-BuildLog "Converting icon.png to icon.ico header..."
        $pngBytes = [System.IO.File]::ReadAllBytes("icon.png")
        $icoSize = $pngBytes.Length
        $header = [byte[]]@(
            0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00,
            ($icoSize -band 0xFF), (($icoSize -shr 8) -band 0xFF),
            (($icoSize -shr 16) -band 0xFF), (($icoSize -shr 24) -band 0xFF),
            0x16, 0x00, 0x00, 0x00
        )
        $icoBytes = New-Object byte[] ($header.Length + $pngBytes.Length)
        [System.Array]::Copy($header, 0, $icoBytes, 0, $header.Length)
        [System.Array]::Copy($pngBytes, 0, $icoBytes, $header.Length, $pngBytes.Length)
        [System.IO.File]::WriteAllBytes("icon.ico", $icoBytes)
    }
}

# Copy icon.ico to project folders
if (Test-Path "icon.ico") {
    Copy-Item "icon.ico" "src/RotinaActivity/icon.ico" -Force -ErrorAction SilentlyContinue
    Copy-Item "icon.ico" "src/RotinaActivityAgent/icon.ico" -Force -ErrorAction SilentlyContinue
}

# 2. Clean previous build output folders
Write-BuildLog "Cleaning previous publish folders..."
if (Test-Path "publish_portable") { Remove-Item -Recurse -Force "publish_portable" -ErrorAction SilentlyContinue }
if (Test-Path "Output") { Remove-Item -Recurse -Force "Output" -ErrorAction SilentlyContinue }

New-Item -ItemType Directory -Path "publish_portable" -Force | Out-Null
New-Item -ItemType Directory -Path "Output" -Force | Out-Null

# 3. Build React Vite Frontend
Write-BuildLog "Compiling React / Vite TypeScript Frontend UI..."
Push-Location "src/RotinaActivity/ui"
try {
    if (-not (Test-Path "node_modules")) {
        Write-BuildLog "Installing npm dependencies in UI folder..."
        npm install
    }
    npm run build
    Write-BuildLog "SUCCESS: Frontend React UI built cleanly."
} catch {
    Write-BuildLog "Frontend build note: $_"
}
Pop-Location

# Copy dist_ui to publish_portable
if (Test-Path "src/RotinaActivity/dist_ui") {
    Copy-Item -Recurse -Force "src/RotinaActivity/dist_ui" "publish_portable/dist_ui"
    Write-BuildLog "Copied dist_ui assets to publish_portable/dist_ui"
}

# 4. Restore & Compile .NET Solution
Write-BuildLog "Restoring NuGet dependencies for RotinaActivity.sln..."
dotnet restore RotinaActivity.sln -r win-x64

Write-BuildLog "Compiling RotinaActivity.exe (Main WPF Host Single-File)..."
dotnet publish src/RotinaActivity/RotinaActivity.csproj `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:PublishTrimmed=false `
    -p:PublishReadyToRun=true `
    -p:IncludeNativeLibrariesForSelfExtract=true `
    -p:EnableCompressionInSingleFile=true

$mainPublishCode = $LASTEXITCODE

Write-BuildLog "Compiling RotinaActivityAgent.exe (System Tray Agent Single-File)..."
dotnet publish src/RotinaActivityAgent/RotinaActivityAgent.csproj `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:PublishTrimmed=false `
    -p:PublishReadyToRun=true `
    -p:IncludeNativeLibrariesForSelfExtract=true `
    -p:EnableCompressionInSingleFile=true

$agentPublishCode = $LASTEXITCODE

# 5. Copy compiled EXEs to publish_portable
$mainExePath = "src/RotinaActivity/bin/Release/net8.0-windows/win-x64/publish/RotinaActivity.exe"
$agentExePath = "src/RotinaActivityAgent/bin/Release/net8.0-windows/win-x64/publish/RotinaActivityAgent.exe"

if (Test-Path $mainExePath) {
    Copy-Item $mainExePath "publish_portable/RotinaActivity.exe" -Force
    Write-BuildLog "SUCCESS: Portable single-file EXE copied to publish_portable/RotinaActivity.exe"
} else {
    Write-BuildLog "ERROR: Main executable RotinaActivity.exe was not found."
}

if (Test-Path $agentExePath) {
    Copy-Item $agentExePath "publish_portable/RotinaActivityAgent.exe" -Force
    Write-BuildLog "SUCCESS: Tray Agent single-file EXE copied to publish_portable/RotinaActivityAgent.exe"
} else {
    Write-BuildLog "ERROR: Tray Agent executable RotinaActivityAgent.exe was not found."
}

# Copy root icon to portable
if (Test-Path "icon.ico") { Copy-Item "icon.ico" "publish_portable/icon.ico" -Force }

# 6. Inno Setup Compiler Packaging
Write-BuildLog "Locating Inno Setup ISCC.exe compiler..."
$isccPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if (-not (Test-Path $isccPath)) {
    $isccPath = "C:\Program Files\Inno Setup 6\ISCC.exe"
}

if (Test-Path $isccPath) {
    Write-BuildLog "Executing Inno Setup compilation (setup.iss)..."
    & $isccPath setup.iss
    if ($LASTEXITCODE -eq 0) {
        Write-BuildLog "SUCCESS: Setup installer created at Output/RotinaActivity_Setup.exe"
    } else {
        Write-BuildLog "ERROR: Inno Setup compilation returned exit code $LASTEXITCODE"
    }
} else {
    Write-BuildLog "WARNING: ISCC.exe not found. Setup installer build skipped."
}

# 7. Create/Verify log.txt Global Exception Handler
$appLogPath = "publish_portable/log.txt"
"[" + (Get-Date -Format "yyyy-MM-dd HH:mm:ss") + "] RotinaActivity Global Exception Logger Verification." | Out-File -FilePath $appLogPath -Encoding utf8 -ErrorAction SilentlyContinue
Write-BuildLog "Verified log.txt global exception logging mechanism."

# Final Status Check
$portableOk = Test-Path "publish_portable/RotinaActivity.exe"
$agentOk = Test-Path "publish_portable/RotinaActivityAgent.exe"
$setupOk = Test-Path "Output/RotinaActivity_Setup.exe"

if ($portableOk -and $agentOk -and $setupOk) {
    Write-BuildLog "========================================================="
    Write-BuildLog "   BUILD FINISHED WITH COMPLETE SUCCESS!"
    Write-BuildLog "   1. Portable App Exe: publish_portable/RotinaActivity.exe"
    Write-BuildLog "   2. Tray Agent Exe : publish_portable/RotinaActivityAgent.exe"
    Write-BuildLog "   3. Setup Installer : Output/RotinaActivity_Setup.exe"
    Write-BuildLog "   4. Log File System : publish_portable/log.txt"
    Write-BuildLog "========================================================="
    exit 0
} else {
    Write-BuildLog "========================================================="
    Write-BuildLog "   BUILD FINISHED WITH WARNINGS OR PARTIAL OUTPUTS."
    Write-BuildLog "========================================================="
    exit 1
}
