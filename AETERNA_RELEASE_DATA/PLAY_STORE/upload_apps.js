const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const KEY_FILE = path.join(__dirname, '../keys/service-account.json');
const APK_DIR = path.join(__dirname, '../APK_DEPLOY');

const apps = [
    {
        packageName: 'com.aeterna.deepshield',
        apkName: 'deepshield-release.apk',
        title: 'DeepShield — AI Security Scanner',
        shortDesc: 'AI-powered security scanner. Detect threats, audit permissions, protect privacy.',
        fullDesc: 'DeepShield is your personal AI-powered security sentinel for Android.\n\n🛡️ REAL-TIME THREAT DETECTION\nContinuously monitors your device for malware, suspicious applications, and potential security vulnerabilities.'
    },
    {
        packageName: 'com.aeterna.mindforge',
        apkName: 'mindforge-release.apk',
        title: 'MindForge — Mental Wellness Coach',
        shortDesc: 'Guided breathing, meditation & cognitive training. Your personal wellness coach.',
        fullDesc: 'MindForge is a premium mental wellness companion designed for the modern mind.\n\n🧠 COGNITIVE TRAINING\nSharpen focus, memory, and mental clarity through scientifically-designed exercises.'
    },
    {
        packageName: 'com.aeterna.wealthguard',
        apkName: 'wealthguard-release.apk',
        title: 'WealthGuard — Smart Finance Tracker',
        shortDesc: 'Track expenses, monitor budgets, detect anomalies. Your wealth, protected.',
        fullDesc: 'WealthGuard puts you in control of your financial health.\n\n💰 EXPENSE TRACKING\nLog transactions effortlessly. Categorize spending, add notes, and maintain a complete financial diary.'
    },
    {
        packageName: 'com.aeterna.netguard',
        apkName: 'netguard-release.apk',
        title: 'NetGuard — Network Security Monitor',
        shortDesc: 'Monitor network traffic, detect threats, analyze connections in real-time.',
        fullDesc: 'NetGuard gives you complete visibility into your device\'s network activity.\n\n🌐 TRAFFIC MONITOR\nSee every connection your device makes — in real-time.'
    },
    {
        packageName: 'com.aeterna.aqualedger',
        apkName: 'aqualedger-release.apk',
        title: 'AquaLedger — Smart Water Tracker',
        shortDesc: 'Track daily water intake with smart reminders. Stay hydrated, stay healthy.',
        fullDesc: 'AquaLedger makes hydration effortless and data-driven.\n\n💧 QUICK LOGGING\nLog water intake with a single tap.'
    },
    {
        packageName: 'com.aeterna.codemedic',
        apkName: 'codemedic-release.apk',
        title: 'CodeMedic — Developer Diagnostics',
        shortDesc: 'Log analysis, regex builder & code diagnostics — developer tools on the go.',
        fullDesc: 'CodeMedic puts essential developer diagnostics in your pocket.\n\n🔧 CODE DIAGNOSTICS\nPaste code snippets and get instant analysis.'
    }
];

async function uploadApp(androidPublisher, app) {
    console.log(`\n--- Starting upload for: ${app.packageName} ---`);
    const apkPath = path.join(APK_DIR, app.apkName);

    if (!fs.existsSync(apkPath)) {
        console.error(`Error: APK not found at ${apkPath}`);
        return;
    }

    try {
        // 1. Start a new edit
        const edit = await androidPublisher.edits.insert({
            packageName: app.packageName
        });
        const editId = edit.data.id;
        console.log(`Edit created: ${editId}`);

        // 2. Upload APK
        console.log(`Uploading APK...`);
        const res = await androidPublisher.edits.apks.upload({
            editId: editId,
            packageName: app.packageName,
            media: {
                mimeType: 'application/vnd.android.package-archive',
                body: fs.createReadStream(apkPath)
            }
        });
        const versionCode = res.data.versionCode;
        console.log(`APK uploaded. Version Code: ${versionCode}`);

        // 3. Update track (Internal)
        console.log(`Moving to internal track...`);
        await androidPublisher.edits.tracks.update({
            editId: editId,
            packageName: app.packageName,
            track: 'internal',
            requestBody: {
                releases: [{
                    versionCodes: [versionCode.toString()],
                    status: 'completed'
                }]
            }
        });

        // 4. Update Listings (Metadata) - Language: en-US
        console.log(`Updating listings...`);
        await androidPublisher.edits.listings.update({
            editId: editId,
            packageName: app.packageName,
            language: 'en-US',
            requestBody: {
                title: app.title,
                shortDescription: app.shortDesc,
                fullDescription: app.fullDesc
            }
        });

        // 5. Commit the edit
        console.log(`Committing changes...`);
        await androidPublisher.edits.commit({
            editId: editId,
            packageName: app.packageName
        });

        console.log(`Successfully uploaded and committed ${app.packageName}!`);
    } catch (err) {
        console.error(`Failed to upload ${app.packageName}:`, err.message);
        if (err.errors) {
            err.errors.forEach(e => console.error(`- ${e.message}`));
        }
    }
}

async function run() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/androidpublisher']
    });

    const authClient = await auth.getClient();
    const androidPublisher = google.androidpublisher({
        version: 'v3',
        auth: authClient
    });

    for (const app of apps) {
        await uploadApp(androidPublisher, app);
    }
}

run().catch(console.error);
