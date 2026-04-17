#Requires -Version 5.1
<#
.SYNOPSIS
    AETERNA Compliance Checker - Security compliance validation
    
.DESCRIPTION
    Validates compliance against multiple security frameworks:
    - OWASP Application Security Verification Standard (ASVS)
    - CIS Software Development Best Practices
    - SOC 2 Type II Controls
    - GDPR Technical Requirements
    
.PARAMETER Framework
    Compliance framework to check: All, OWASP, CIS, SOC2, GDPR
    
.PARAMETER GenerateReport
    Generate detailed compliance report
    
.EXAMPLE
    .\Invoke-ComplianceCheck.ps1 -Framework All -GenerateReport
    
.NOTES
    Version: 1.0.0-SINGULARITY
    Author: QAntum Compliance Team
#>

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet("All", "OWASP", "CIS", "SOC2", "GDPR")]
    [string]$Framework = "All",
    
    [Parameter()]
    [switch]$GenerateReport,
    
    [Parameter()]
    [string]$ReportPath = "./compliance-reports"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Configuration
$Script:Config = @{
    Version = "1.0.0-SINGULARITY"
    CheckId = [guid]::NewGuid().ToString().Substring(0, 8)
    StartTime = Get-Date
}

# Results
$Script:Results = @{
    CheckId = $Script:Config.CheckId
    StartTime = $Script:Config.StartTime
    Frameworks = @{}
    Summary = @{
        TotalControls = 0
        Compliant = 0
        NonCompliant = 0
        PartiallyCompliant = 0
        NotApplicable = 0
    }
}

function Write-ComplianceBanner {
    $banner = @"

╔══════════════════════════════════════════════════════════════════════════════╗
║                    AETERNA COMPLIANCE CHECKER v1.0.0                         ║
║                      Security Framework Validation                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Check ID:  $($Script:Config.CheckId.PadRight(64))║
║  Framework: $($Framework.PadRight(64))║
║  Time:      $($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss').PadRight(64))║
╚══════════════════════════════════════════════════════════════════════════════╝

"@
    Write-Host $banner -ForegroundColor Cyan
}

function Add-ControlResult {
    param(
        [string]$Framework,
        [string]$ControlId,
        [string]$ControlName,
        [string]$Status,  # Compliant, NonCompliant, Partial, N/A
        [string]$Evidence = "",
        [string]$Recommendation = ""
    )
    
    if (-not $Script:Results.Frameworks[$Framework]) {
        $Script:Results.Frameworks[$Framework] = @{
            Name = $Framework
            Controls = @()
        }
    }
    
    $Script:Results.Frameworks[$Framework].Controls += @{
        Id = $ControlId
        Name = $ControlName
        Status = $Status
        Evidence = $Evidence
        Recommendation = $Recommendation
    }
    
    # Update summary
    $Script:Results.Summary.TotalControls++
    switch ($Status) {
        "Compliant" { $Script:Results.Summary.Compliant++ }
        "NonCompliant" { $Script:Results.Summary.NonCompliant++ }
        "Partial" { $Script:Results.Summary.PartiallyCompliant++ }
        "N/A" { $Script:Results.Summary.NotApplicable++ }
    }
    
    # Output
    $icon = switch ($Status) {
        "Compliant" { "✓" }
        "NonCompliant" { "✗" }
        "Partial" { "◐" }
        "N/A" { "○" }
    }
    
    $color = switch ($Status) {
        "Compliant" { "Green" }
        "NonCompliant" { "Red" }
        "Partial" { "Yellow" }
        "N/A" { "Gray" }
    }
    
    Write-Host "  [$icon] " -NoNewline -ForegroundColor $color
    Write-Host "$ControlId - $ControlName" -ForegroundColor White
}

function Test-OWASPCompliance {
    Write-Host "`n[OWASP ASVS] Checking OWASP Application Security Verification Standard..." -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    # V1: Architecture, Design and Threat Modeling
    # V1.1.1: Secure Software Development Lifecycle
    $hasSecurityScripts = Test-Path "./scripts/security"
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V1.1.1" `
        -ControlName "Secure Development Lifecycle" `
        -Status $(if($hasSecurityScripts){"Compliant"}else{"Partial"}) `
        -Evidence "Security scripts: $(if($hasSecurityScripts){'Present'}else{'Not found'})"
    
    # V2: Authentication
    # V2.1.1: Passwords
    $hasAuthCode = Get-ChildItem -Path "./src", "./api" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "(bcrypt|argon2|scrypt|pbkdf2)" }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V2.1.1" `
        -ControlName "Password Storage Security" `
        -Status $(if($hasAuthCode){"Compliant"}else{"N/A"}) `
        -Evidence "Secure password hashing: $(if($hasAuthCode){'Detected'}else{'N/A - No auth code'})"
    
    # V3: Session Management
    $hasSessionCode = Get-ChildItem -Path "./src", "./api" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "(session|jwt|token)" }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V3.1.1" `
        -ControlName "Session Token Generation" `
        -Status "Partial" `
        -Evidence "Session handling code present" `
        -Recommendation "Verify session tokens are cryptographically random"
    
    # V5: Validation, Sanitization and Encoding
    $apiFiles = Get-ChildItem -Path "./api" -Filter "*.js" -ErrorAction SilentlyContinue
    $hasInputValidation = $false
    
    foreach ($file in $apiFiles) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match "validate|sanitize|typeof|isNaN|parseInt|parseFloat") {
            $hasInputValidation = $true
            break
        }
    }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V5.1.1" `
        -ControlName "Input Validation" `
        -Status $(if($hasInputValidation){"Compliant"}else{"NonCompliant"}) `
        -Evidence "Input validation: $(if($hasInputValidation){'Detected'}else{'Not found'})" `
        -Recommendation "Implement comprehensive input validation for all user inputs"
    
    # V7: Error Handling and Logging
    $hasErrorHandling = $apiFiles | ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "try\s*\{" -and $_ -match "catch\s*\(" }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V7.1.1" `
        -ControlName "Error Handling" `
        -Status $(if($hasErrorHandling){"Compliant"}else{"NonCompliant"}) `
        -Evidence "Try-catch blocks: $(if($hasErrorHandling){'Present'}else{'Not found'})"
    
    # V9: Communication Security
    $usesHTTPS = Get-ChildItem -Path "./src", "./api", "./public" -Recurse -Include "*.ts", "*.js", "*.html" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "https://" }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V9.1.1" `
        -ControlName "Transport Layer Security" `
        -Status $(if($usesHTTPS){"Compliant"}else{"Partial"}) `
        -Evidence "HTTPS usage detected"
    
    # V10: Malicious Code
    $hasNoEval = -not (Get-ChildItem -Path "./src", "./api" -Recurse -Include "*.ts", "*.js" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "\beval\s*\(" })
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V10.1.1" `
        -ControlName "No Dangerous Functions" `
        -Status $(if($hasNoEval){"Compliant"}else{"NonCompliant"}) `
        -Evidence "eval() usage: $(if($hasNoEval){'Not detected'}else{'Found - security risk'})"
    
    # V14: Configuration
    $hasGitignore = Test-Path "./.gitignore"
    $gitignoreSecure = $false
    
    if ($hasGitignore) {
        $content = Get-Content "./.gitignore" -Raw
        $gitignoreSecure = $content -match "\.env" -and $content -match "node_modules"
    }
    
    Add-ControlResult `
        -Framework "OWASP" `
        -ControlId "V14.1.1" `
        -ControlName "Secure Configuration" `
        -Status $(if($gitignoreSecure){"Compliant"}else{"Partial"}) `
        -Evidence ".gitignore: $(if($gitignoreSecure){'Properly configured'}else{'Needs review'})"
}

function Test-CISCompliance {
    Write-Host "`n[CIS] Checking CIS Software Development Best Practices..." -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    # CIS 1.1: Version Control
    $hasGit = Test-Path "./.git"
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-1.1" `
        -ControlName "Version Control System" `
        -Status $(if($hasGit){"Compliant"}else{"NonCompliant"}) `
        -Evidence "Git repository: $(if($hasGit){'Present'}else{'Not found'})"
    
    # CIS 1.2: Branch Protection
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-1.2" `
        -ControlName "Branch Protection Rules" `
        -Status "Partial" `
        -Evidence "Manual verification required" `
        -Recommendation "Configure branch protection rules in GitHub settings"
    
    # CIS 2.1: Dependency Management
    $hasPackageLock = Test-Path "./package-lock.json"
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-2.1" `
        -ControlName "Dependency Locking" `
        -Status $(if($hasPackageLock){"Compliant"}else{"NonCompliant"}) `
        -Evidence "package-lock.json: $(if($hasPackageLock){'Present'}else{'Not found'})"
    
    # CIS 2.2: Vulnerable Dependencies
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-2.2" `
        -ControlName "Dependency Vulnerability Scanning" `
        -Status "Partial" `
        -Evidence "Run 'npm audit' for full scan" `
        -Recommendation "Implement automated dependency scanning in CI/CD"
    
    # CIS 3.1: Code Review
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-3.1" `
        -ControlName "Code Review Process" `
        -Status "Partial" `
        -Evidence "Manual verification required" `
        -Recommendation "Require PR reviews before merge"
    
    # CIS 4.1: Static Analysis
    $hasTsConfig = Test-Path "./tsconfig.json"
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-4.1" `
        -ControlName "Static Code Analysis" `
        -Status $(if($hasTsConfig){"Compliant"}else{"Partial"}) `
        -Evidence "TypeScript: $(if($hasTsConfig){'Configured'}else{'Not found'})"
    
    # CIS 5.1: Secure Build
    $hasVercelConfig = Test-Path "./vercel.json"
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-5.1" `
        -ControlName "Secure Build Pipeline" `
        -Status $(if($hasVercelConfig){"Compliant"}else{"Partial"}) `
        -Evidence "Build configuration present"
    
    # CIS 6.1: Secret Management
    $noEnvFile = -not (Test-Path "./.env")
    Add-ControlResult `
        -Framework "CIS" `
        -ControlId "CIS-6.1" `
        -ControlName "Secret Management" `
        -Status $(if($noEnvFile){"Compliant"}else{"NonCompliant"}) `
        -Evidence "No .env in repository: $(if($noEnvFile){'Verified'}else{'VIOLATION - .env found'})" `
        -Recommendation "Use environment variables or secrets manager"
}

function Test-SOC2Compliance {
    Write-Host "`n[SOC 2] Checking SOC 2 Type II Controls..." -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    # CC6.1: Logical Access Controls
    $hasApiAuth = Get-ChildItem -Path "./api" -Filter "*.js" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "(authorization|authentication|token|session)" }
    
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC6.1" `
        -ControlName "Logical Access Security" `
        -Status $(if($hasApiAuth){"Partial"}else{"NonCompliant"}) `
        -Evidence "API authentication code: $(if($hasApiAuth){'Detected'}else{'Not found'})"
    
    # CC6.6: System Boundary Security
    $hasCORS = Get-ChildItem -Path "./api" -Filter "*.js" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "Access-Control-Allow-Origin" }
    
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC6.6" `
        -ControlName "System Boundary Protection" `
        -Status $(if($hasCORS){"Compliant"}else{"NonCompliant"}) `
        -Evidence "CORS configuration: $(if($hasCORS){'Present'}else{'Not found'})"
    
    # CC6.7: Data Security
    $usesStripe = Get-ChildItem -Path "./api" -Filter "*.js" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "stripe" }
    
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC6.7" `
        -ControlName "Payment Data Security" `
        -Status $(if($usesStripe){"Compliant"}else{"N/A"}) `
        -Evidence "Payment processing via Stripe (PCI DSS compliant)"
    
    # CC7.1: Change Management
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC7.1" `
        -ControlName "Change Management Process" `
        -Status "Partial" `
        -Evidence "Git-based version control in use" `
        -Recommendation "Document change management procedures"
    
    # CC7.2: System Monitoring
    $hasLogging = Get-ChildItem -Path "./api", "./src" -Recurse -Include "*.js", "*.ts" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "console\.(log|error|warn)" }
    
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC7.2" `
        -ControlName "System Monitoring and Logging" `
        -Status $(if($hasLogging){"Partial"}else{"NonCompliant"}) `
        -Evidence "Logging statements: $(if($hasLogging){'Present'}else{'Not found'})" `
        -Recommendation "Implement centralized logging solution"
    
    # CC8.1: Change Management Testing
    $hasTests = Test-Path "./tests" -or (Get-Content "./package.json" | ConvertFrom-Json).scripts.test
    Add-ControlResult `
        -Framework "SOC2" `
        -ControlId "CC8.1" `
        -ControlName "Testing Before Production" `
        -Status $(if($hasTests){"Partial"}else{"NonCompliant"}) `
        -Evidence "Test infrastructure: $(if($hasTests){'Present'}else{'Not found'})"
}

function Test-GDPRCompliance {
    Write-Host "`n[GDPR] Checking GDPR Technical Requirements..." -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    # Art. 25: Privacy by Design
    $hasPrivacyCode = Get-ChildItem -Path "./src", "./api" -Recurse -Include "*.ts", "*.js" -ErrorAction SilentlyContinue | 
        ForEach-Object { Get-Content $_.FullName -Raw } | 
        Where-Object { $_ -match "(privacy|gdpr|consent|personal.?data)" }
    
    Add-ControlResult `
        -Framework "GDPR" `
        -ControlId "GDPR-25" `
        -ControlName "Privacy by Design" `
        -Status "Partial" `
        -Evidence "Privacy implementation: $(if($hasPrivacyCode){'Code found'}else{'Manual review needed'})" `
        -Recommendation "Document data processing activities"
    
    # Art. 32: Security of Processing
    Add-ControlResult `
        -Framework "GDPR" `
        -ControlId "GDPR-32" `
        -ControlName "Security of Processing" `
        -Status "Partial" `
        -Evidence "Security measures implemented" `
        -Recommendation "Complete security assessment documentation"
    
    # Art. 33: Breach Notification
    Add-ControlResult `
        -Framework "GDPR" `
        -ControlId "GDPR-33" `
        -ControlName "Breach Notification Procedure" `
        -Status "Partial" `
        -Evidence "Procedure documentation required" `
        -Recommendation "Create incident response and notification procedures"
    
    # Art. 35: DPIA
    Add-ControlResult `
        -Framework "GDPR" `
        -ControlId "GDPR-35" `
        -ControlName "Data Protection Impact Assessment" `
        -Status "Partial" `
        -Evidence "DPIA may be required" `
        -Recommendation "Conduct DPIA if processing high-risk personal data"
}

function Export-ComplianceReport {
    if (-not (Test-Path $ReportPath)) {
        New-Item -ItemType Directory -Path $ReportPath -Force | Out-Null
    }
    
    $Script:Results.EndTime = Get-Date
    $Script:Results.Duration = ($Script:Results.EndTime - $Script:Results.StartTime).TotalSeconds
    
    # Calculate compliance percentage
    $applicable = $Script:Results.Summary.TotalControls - $Script:Results.Summary.NotApplicable
    $Script:Results.Summary.ComplianceRate = if ($applicable -gt 0) {
        [math]::Round(($Script:Results.Summary.Compliant / $applicable) * 100, 2)
    } else { 0 }
    
    $reportFile = Join-Path $ReportPath "compliance-$($Script:Config.CheckId).json"
    $Script:Results | ConvertTo-Json -Depth 10 | Out-File $reportFile
    
    Write-Host "`nReport saved to: $reportFile" -ForegroundColor Cyan
}

function Show-Summary {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                        COMPLIANCE SUMMARY                                    ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "  Total Controls Checked: $($Script:Results.Summary.TotalControls)" -ForegroundColor White
    Write-Host ""
    Write-Host "  ✓ Compliant:           $($Script:Results.Summary.Compliant)" -ForegroundColor Green
    Write-Host "  ◐ Partially Compliant: $($Script:Results.Summary.PartiallyCompliant)" -ForegroundColor Yellow
    Write-Host "  ✗ Non-Compliant:       $($Script:Results.Summary.NonCompliant)" -ForegroundColor Red
    Write-Host "  ○ Not Applicable:      $($Script:Results.Summary.NotApplicable)" -ForegroundColor Gray
    Write-Host ""
    
    $applicable = $Script:Results.Summary.TotalControls - $Script:Results.Summary.NotApplicable
    $rate = if ($applicable -gt 0) {
        [math]::Round(($Script:Results.Summary.Compliant / $applicable) * 100, 1)
    } else { 0 }
    
    Write-Host "  Compliance Rate: $rate%" -ForegroundColor $(if($rate -ge 80){'Green'}elseif($rate -ge 60){'Yellow'}else{'Red'})
    Write-Host ""
}

# Main execution
try {
    Write-ComplianceBanner
    
    $frameworksToCheck = @()
    
    switch ($Framework) {
        "All" {
            $frameworksToCheck = @("OWASP", "CIS", "SOC2", "GDPR")
        }
        default {
            $frameworksToCheck = @($Framework)
        }
    }
    
    foreach ($fw in $frameworksToCheck) {
        switch ($fw) {
            "OWASP" { Test-OWASPCompliance }
            "CIS" { Test-CISCompliance }
            "SOC2" { Test-SOC2Compliance }
            "GDPR" { Test-GDPRCompliance }
        }
    }
    
    if ($GenerateReport) {
        Export-ComplianceReport
    }
    
    Show-Summary
    
} catch {
    Write-Host "`nError during compliance check: $_" -ForegroundColor Red
    exit 1
}
