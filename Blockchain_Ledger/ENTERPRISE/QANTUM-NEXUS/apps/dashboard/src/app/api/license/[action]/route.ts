import { NextResponse } from 'next/server';
import crypto from 'crypto';

// The Absolute Sovereign Secret - Used for zero-entropy License Validation
const SUPREME_MASTER_SECRET = '0x41_45_54_45_52_4e_41_5f_LOGOS_DIMIТAR_PRODROMOV!';

export async function POST(req: Request, { params }: { params: { action: string } }) {
    const action = params.action; // 'activate', 'validate', 'deactivate'

    try {
        const body = await req.json();
        
        if (action === 'deactivate') {
            // Simplified deactivation placeholder
            return NextResponse.json({ success: true, message: 'Deactivated' });
        }

        const licenseKey = body.licenseKey;
        const hardwareId = body.machineId || 'KNOX_ANY';

        if (!licenseKey || !licenseKey.startsWith('AETERNA-NEXUS-')) {
            return NextResponse.json({ valid: false, message: 'Invalid format' }, { status: 400 });
        }

        const raw = licenseKey.replace('AETERNA-NEXUS-', '');
        const dotIndex = raw.lastIndexOf('.');
        if (dotIndex === -1) {
            return NextResponse.json({ valid: false, message: 'Invalid signature pattern' }, { status: 400 });
        }

        const dataStr = raw.substring(0, dotIndex);
        const signature = raw.substring(dotIndex + 1);

        // Recompute the HMAC Signature
        const expectedSig = crypto
            .createHmac('sha512', SUPREME_MASTER_SECRET)
            .update(dataStr)
            .digest('hex');

        // Timing-safe comparison to prevent brute-force
        if (signature.length !== expectedSig.length) {
            return NextResponse.json({ valid: false, message: 'Signature length mismatch' }, { status: 401 });
        }
        
        const sigBuf = Buffer.from(signature, 'hex');
        const expectedBuf = Buffer.from(expectedSig, 'hex');
        
        if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
            return NextResponse.json({ valid: false, message: 'Signature validation failed' }, { status: 401 });
        }

        // Signature is valid. Decode Payload.
        const payload = JSON.parse(Buffer.from(dataStr, 'base64').toString('utf8'));
        
        if (Date.now() > payload.e) {
            return NextResponse.json({ valid: false, message: 'License expired. Renew required.' }, { status: 403 });
        }

        if (hardwareId !== 'KNOX_ANY' && payload.h !== 'KNOX_ANY' && payload.h !== hardwareId) {
            return NextResponse.json({ valid: false, message: 'Hardware mismatch. Machine not authorized.' }, { status: 403 });
        }

        // Successful validation. Return expected LicenseData payload structure.
        return NextResponse.json({
            valid: true,
            tier: payload.t,
            expiresIn: payload.e - Date.now(),
            features: ['*', 'ghostProtocol', 'preCog', 'swarmExecution'],
            limits: { maxWorkers: 999, maxTestsPerDay: 10000 },
            message: 'AETERNA NEXUS Validated',
            
            // Re-echo for local cache consistency matching the mock LicenseData structure
            licenseKey,
            organization: payload.c || 'QAntum Empire',
            machineId: payload.h,
            issuedAt: Date.now() - 1000,
            expiresAt: payload.e,
            signature: 'signature-verified-by-server'
        });

    } catch (err: any) {
        return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
    }
}
