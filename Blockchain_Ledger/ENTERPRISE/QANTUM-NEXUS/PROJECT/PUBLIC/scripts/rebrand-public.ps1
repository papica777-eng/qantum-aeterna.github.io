# ═══════════════════════════════════════════════════════════════════════════════
# ⚛️ QANTUM PUBLIC WEBSITE REBRAND SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════
# 
# Updates all public-facing content: Website, Docs, Demo
# @author dp | QAntum Labs
#
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"
$PublicRoot = "C:\MisteMind\PROJECT\PUBLIC"

Write-Host @"

    ██████╗  █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗
   ██╔═══██╗██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║
   ██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║
   ██║▄▄ ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║
   ╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
    ╚══▀▀═╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝

        ⚛️ PUBLIC WEBSITE REBRAND SCRIPT ⚛️
                 [ dp ] qantum labs

"@ -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════════
# REPLACEMENTS CONFIG
# ═══════════════════════════════════════════════════════════════════════════════

$Replacements = @{
    # Brand names
    'Mind-Engine' = 'QAntum'
    'MindEngine' = 'QAntum'
    'MrMind' = 'QAntum'
    'Mr Mind' = 'QAntum'
    'Mister Mind' = 'QAntum'
    'mister-mind' = 'qantum'
    '@mind-engine/core' = 'qantum'
    
    # Package/import names
    'createMindEngine' = 'createQA'
    'createMM' = 'createQA'
    
    # Titles
    'Enterprise Test Automation Framework' = 'The Autonomous QA Agent'
    'AI-Powered Enterprise Test Automation' = 'Beyond Classical Testing'
}

$Stats = @{
    FilesScanned = 0
    FilesModified = 0
    TotalReplacements = 0
}

# ═══════════════════════════════════════════════════════════════════════════════
# PROCESS FILES
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  SCANNING PUBLIC FOLDER: $PublicRoot" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

$extensions = @("*.html", "*.md", "*.json", "*.ts", "*.js", "*.css")
$skipDirs = @("node_modules", "dist", ".git")

foreach ($ext in $extensions) {
    $files = Get-ChildItem -Path $PublicRoot -Filter $ext -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { 
            $skip = $false
            foreach ($dir in $skipDirs) {
                if ($_.FullName -match [regex]::Escape($dir)) { $skip = $true; break }
            }
            -not $skip
        }
    
    foreach ($file in $files) {
        $Stats.FilesScanned++
        $modified = $false
        
        try {
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            if (-not $content) { continue }
            
            $originalContent = $content
            
            foreach ($key in $Replacements.Keys) {
                if ($content -match [regex]::Escape($key)) {
                    $content = $content -replace [regex]::Escape($key), $Replacements[$key]
                    $Stats.TotalReplacements++
                    $modified = $true
                }
            }
            
            if ($modified) {
                Set-Content $file.FullName $content -NoNewline -ErrorAction Stop
                $Stats.FilesModified++
                Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "   ❌ Error: $($file.Name) - $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  ⚛️ PUBLIC REBRAND COMPLETE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "   📊 STATISTICS:" -ForegroundColor Cyan
Write-Host "   ├─ Files Scanned:    $($Stats.FilesScanned)" -ForegroundColor White
Write-Host "   ├─ Files Modified:   $($Stats.FilesModified)" -ForegroundColor White
Write-Host "   └─ Replacements:     $($Stats.TotalReplacements)" -ForegroundColor White
Write-Host ""
Write-Host "   [ dp ] qantum labs © 2025" -ForegroundColor DarkGray
Write-Host ""
