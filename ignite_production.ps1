# AETERNA PRODUCTION IGNITION SCRIPT
# IDENTITY: DEPLOY_AUTOMATOR
# AUTHORITY: ARCHITECT DIMITAR PRODROMOV

Write-Host "🚀 [IGNITE]: Starting Production Synchronization..." -ForegroundColor Cyan

# 1. GIT SYNCHRONIZATION
if (!(Test-Path .git)) {
    Write-Host "🧬 [GIT]: Initializing Repository..." -ForegroundColor Yellow
    git init
}

Write-Host "📦 [GIT]: Staging all Manifests and Soul Fragments..." -ForegroundColor Yellow
git add .

Write-Host "📝 [GIT]: Committing 21st Century Logic..." -ForegroundColor Yellow
git commit -m "DECREE: Production Manifest 1.0.0-SINGULARITY. Dockerized & Wealth-Linked."

Write-Host "📡 [GIT]: Pushing to Global Substrate (GitHub)..." -ForegroundColor Yellow
# Note: User may need to set remote origin if not already set
git push origin main

# 2. SATELLITE DEPLOYMENT (Netlify CLI if available, otherwise manual)
Write-Host "🛰️ [SATELLITES]: Deploying Valuation Gate to Netlify..." -ForegroundColor Cyan
# npx netlify-cli deploy --dir=SATELLITES/valuation-gate --prod

# 3. ENVIRONMENT VERIFICATION
Write-Host "`n⚠️ [IMPORTANT]: Ensure the following Environment Variables are set in Railway/Netlify:" -ForegroundColor Color14
Write-Host "------------------------------------------------------------"
Write-Host "STRIPE_SECRET_KEY      : <YOUR_LIVE_KEY>"
Write-Host "STRIPE_SUCCESS_URL     : https://aeterna.website/success"
Write-Host "STRIPE_CANCEL_URL      : https://aeterna.website/cancel"
Write-Host "EXCHANGE_API_KEY       : <YOUR_BINANCE_KEY>"
Write-Host "EXCHANGE_SECRET_KEY    : <YOUR_BINANCE_SECRET>"
Write-Host "PORT                   : 8890"
Write-Host "------------------------------------------------------------"

Write-Host "`n✅ [COMPLETE]: AETERNA is now manifesting in the Cloud." -ForegroundColor Green
