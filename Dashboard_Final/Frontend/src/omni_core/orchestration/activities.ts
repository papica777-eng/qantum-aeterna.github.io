import { applyPatchToCodebase } from "./utils/git-patcher";
import { SandboxGuard } from '../security/SandboxGuard';
import { EvolutionNotary } from '../governance/EvolutionNotary';
import { Logger } from '../telemetry/Logger';

/**
 * 🏗️ Temporal Activities for VortexEvolutionWorkflow
 * 
 * These activities are executed by Temporal Workers and can be retried
 * independently if failures occur.
 * 
 * Each activity is idempotent and provides strong consistency guarantees.
 */

const logger = Logger.getInstance();
const sandbox = SandboxGuard.getInstance();

/**
 * Activity: Validates code in EnterpriseSandbox
 * 
 * @param code - Code to validate
 * @throws Error if validation fails
 */
export async function validateCode(code: string): Promise<void> {
    logger.info('ACTIVITY', '🔍 Validating code in SandboxGuard...');

    // Static analysis
    const syntaxCheck = sandbox.validateCode(code);
    if (!syntaxCheck.safe) {
        throw new Error(`[VALIDATION_FAILED]: ${syntaxCheck.reason}`);
    }

    // Dynamic execution test
    try {
        await sandbox.executeSecurely(code, 5000); // 5s timeout
        logger.info('ACTIVITY', '✅ Code validation successful');
    } catch (error: any) {
        logger.error('ACTIVITY', '❌ Code validation failed', error);
        throw new Error(`[SANDBOX_EXECUTION_FAILED]: ${error.message}`);
    }
}

/**
 * Activity: Applies patch after cryptographic verification
 * 
 * @param code - Code to apply
 * @param signature - Administrator signature (nullable for low-risk changes)
 * @returns Success message
 */
export async function applyPatch(code: string, signature: string | null): Promise<string> {
    logger.info('ACTIVITY', '🔐 Applying patch with cryptographic verification...');

    // If signature provided, verify it
    if (signature) {
        const publicKey = process.env.ADMIN_PUBLIC_KEY;
        if (!publicKey) {
            throw new Error('[GOVERNANCE_ERROR]: ADMIN_PUBLIC_KEY not configured');
        }

        const verified = await EvolutionNotary.verifyAuthorization(code, signature, publicKey);

        if (!verified) {
            throw new Error('[CRYPTOGRAPHIC_VERIFICATION_FAILED]: Invalid administrator signature');
        }

        logger.info('ACTIVITY', '✅ Cryptographic signature verified');
    }



    logger.info('ACTIVITY', `📝 Applying patch (${code.length} bytes)...`);


    await applyPatchToCodebase(code);

    logger.info('ACTIVITY', '✅ Patch applied successfully');
    return `Patch applied successfully at ${new Date().toISOString()}`;
}


// --- Notification Helpers ---

async function sendTelegram(message: string): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.ADMIN_TELEGRAM_ID || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        logger.debug('ACTIVITY', 'Telegram credentials missing, skipping Telegram notification.');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });

        if (!response.ok) {
            logger.error('ACTIVITY', `Telegram notification failed: ${response.statusText}`);
        } else {
            logger.info('ACTIVITY', '✅ Telegram notification sent.');
        }
    } catch (error: any) {
        logger.error('ACTIVITY', 'Failed to send Telegram alert', error);
    }
}

async function sendSlack(message: string): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        logger.debug('ACTIVITY', 'Slack Webhook URL missing, skipping Slack notification.');
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) {
            logger.error('ACTIVITY', `Slack notification failed: ${response.statusText}`);
        } else {
            logger.info('ACTIVITY', '✅ Slack notification sent.');
        }
    } catch (error: any) {
        logger.error('ACTIVITY', 'Failed to send Slack alert', error);
    }
}

async function sendEmail(message: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.SYSTEM_EMAIL || 'system@omnicore.local';

    if (!apiKey || !adminEmail) {
        logger.debug('ACTIVITY', 'SendGrid credentials or Admin Email missing, skipping Email notification.');
        return;
    }

    try {
        const url = 'https://api.sendgrid.com/v3/mail/send';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: adminEmail }] }],
                from: { email: fromEmail },
                subject: '🚨 HIGH-RISK EVOLUTION REQUIRES APPROVAL',
                content: [{ type: 'text/plain', value: message }]
            })
        });

        if (!response.ok) {
            logger.error('ACTIVITY', `Email notification failed: ${response.statusText}`);
        } else {
            logger.info('ACTIVITY', '✅ Email notification sent.');
        }
    } catch (error: any) {
        logger.error('ACTIVITY', 'Failed to send Email alert', error);
    }
}

async function sendPagerDuty(message: string): Promise<void> {
    const routingKey = process.env.PAGERDUTY_ROUTING_KEY;

    if (!routingKey) {
        logger.debug('ACTIVITY', 'PagerDuty Routing Key missing, skipping PagerDuty notification.');
        return;
    }

    try {
        const url = 'https://events.pagerduty.com/v2/enqueue';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                routing_key: routingKey,
                event_action: 'trigger',
                payload: {
                    summary: 'HIGH-RISK EVOLUTION REQUIRES APPROVAL',
                    source: 'OmniCore Orchestrator',
                    severity: 'critical',
                    custom_details: { details: message }
                }
            })
        });

        if (!response.ok) {
            logger.error('ACTIVITY', `PagerDuty notification failed: ${response.statusText}`);
        } else {
            logger.info('ACTIVITY', '✅ PagerDuty notification sent.');
        }
    } catch (error: any) {
        logger.error('ACTIVITY', 'Failed to send PagerDuty alert', error);
    }
}

async function sendSms(message: string): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const adminPhone = process.env.ADMIN_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !adminPhone) {
        logger.debug('ACTIVITY', 'Twilio credentials missing, skipping SMS notification.');
        return;
    }

    try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        const params = new URLSearchParams();
        params.append('To', adminPhone);
        params.append('From', fromNumber);
        params.append('Body', message);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            logger.error('ACTIVITY', `SMS notification failed: ${response.statusText}`);
        } else {
            logger.info('ACTIVITY', '✅ SMS notification sent.');
        }
    } catch (error: any) {
        logger.error('ACTIVITY', 'Failed to send SMS alert', error);
    }
}


/**
 * Activity: Notifies administrator about pending evolution
 * 
 * @param code - The code requiring approval
 */
export async function notifyAdmin(code: string): Promise<void> {
    logger.info('ACTIVITY', '📧 Notifying administrator...');

    const notificationMessage = `
🚨 HIGH-RISK EVOLUTION REQUIRES APPROVAL

Proposed Code:
${code.substring(0, 200)}...

Please review and sign with your private key.
Send approval via: npm run vortex:approve <workflowId> <signature>
  `.trim();

    logger.warn('ACTIVITY', notificationMessage);

    // Run notifications concurrently, resolving whether they fail or not to ensure activity completes
    await Promise.allSettled([
        sendEmail(notificationMessage),
        sendSms(notificationMessage),
        sendTelegram(notificationMessage),
        sendSlack(notificationMessage),
        sendPagerDuty(notificationMessage)
    ]);

    logger.info('ACTIVITY', '✅ Administrator notified');
}

/**
 * Activity: Validates code and heals if needed (Immune System Integration)
 * 
 * This activity bridges the Sandbox validation with the Healing Nexus:
 * 1. Attempts validation in EnterpriseSandbox
 * 2. On success: Generates LivenessToken and registers vitality
 * 3. On failure: Initiates Logic healing and re-validates
 * 
 * @param code - Code to validate
 * @param moduleId - Module identifier for vitality tracking
 * @returns Validated (and possibly healed) code
 */
export async function validateAndHeal(code: string, moduleId: string): Promise<string> {
    logger.info('ACTIVITY', `🔬 Validating code for module: ${moduleId}`);

    try {
        // Step 1: Validate in sandbox
        await validateCode(code);

        // Step 2: Generate LivenessToken on success
        const { VortexHealingNexus } = await import('../evolution/VortexHealingNexus');
        const healingNexus = VortexHealingNexus.getInstance();
        const livenessToken = healingNexus.generateLivenessToken(moduleId, 'HEALTHY');

        // Step 3: Register vitality with ApoptosisModule
        try {
            const { ApoptosisModule } = await import('../evolution/ApoptosisModule');
            const apoptosis = ApoptosisModule.getInstance();
            await apoptosis.registerVitality(moduleId, livenessToken);

            logger.info('ACTIVITY', `✅ Code validated, vitality registered for ${moduleId}`);
        } catch (err) {
            logger.warn('ACTIVITY', 'ApoptosisModule not available, skipping vitality registration');
        }

        return code;

    } catch (error: any) {
        logger.warn('ACTIVITY', `⚠️ Code validation failed: ${error.message}`);
        logger.info('ACTIVITY', '🔬 Initiating Logic Healing via VortexHealingNexus...');

        try {
            // Step 4: Attempt Logic healing
            const { VortexHealingNexus, HealingDomain } = await import('../evolution/VortexHealingNexus');
            const healingNexus = VortexHealingNexus.getInstance();

            const healingResult = await healingNexus.initiateHealing(HealingDomain.LOGIC, {
                path: moduleId,
                error: error.message,
                stack: error.stack,
                failedCode: code
            });

            if (!healingResult.success || !healingResult.artifact) {
                throw new Error(`Logic healing failed: ${healingResult.error}`);
            }

            const healedCode = healingResult.artifact.code || code;

            // Step 5: Re-validate healed code
            logger.info('ACTIVITY', '🔄 Re-validating healed code...');
            await validateCode(healedCode);

            // Step 6: Generate LivenessToken for healed code
            const livenessToken = healingNexus.generateLivenessToken(moduleId, 'RECOVERING');

            try {
                const { ApoptosisModule } = await import('../evolution/ApoptosisModule');
                const apoptosis = ApoptosisModule.getInstance();
                await apoptosis.registerVitality(moduleId, livenessToken);
            } catch (err) {
                logger.warn('ACTIVITY', 'ApoptosisModule not available');
            }

            logger.info('ACTIVITY', `✅ Code healed and validated for ${moduleId}`);
            return healedCode;

        } catch (healingError: any) {
            logger.error('ACTIVITY', `❌ Healing failed: ${healingError.message}`);
            throw new Error(`[VALIDATION_AND_HEALING_FAILED]: ${healingError.message}`);
        }
    }
}
