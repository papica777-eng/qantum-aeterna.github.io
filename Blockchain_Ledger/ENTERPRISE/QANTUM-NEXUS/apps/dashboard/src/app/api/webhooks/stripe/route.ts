import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const SUPREME_MASTER_SECRET = '0x41_45_54_45_52_4e_41_5f_LOGOS_DIMIТAR_PRODROMOV!';

// Helper from LicenseIssuer
function generateEnterpriseLicense(
    clientId: string,
    hardwareId: string = 'KNOX_ANY',
    tierMonths: number = 120
): string {
    const expiryMs = Date.now() + tierMonths * 30 * 24 * 60 * 60 * 1000;

    const payload = {
        c: clientId.trim(),
        h: hardwareId,
        t: 'enterprise',
        e: expiryMs,
        v: '2.0',
    };

    const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto
        .createHmac('sha512', SUPREME_MASTER_SECRET)
        .update(dataStr)
        .digest('hex');

    return `AETERNA-NEXUS-${dataStr}.${signature}`;
}

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature') as string;

        let event: Stripe.Event;

        try {
            if (!webhookSecret) {
                // Warning mode if not set via ENV
                console.warn('[Stripe Webhook] Secret missing, bypassing verification for dev mode only.');
                event = JSON.parse(body);
            } else {
                event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
            }
        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message);
            return new NextResponse('Webhook Error', { status: 400 });
        }

        // Handle the successful payment intent or checkout session
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const customerEmail = session.customer_details?.email || session.customer_email || 'unknown@client.com';
            
            // Assume 120 months (10 years) Enterprise license generated automatically
            const newKey = generateEnterpriseLicense(customerEmail);

            console.log(`\n======================================================`);
            console.log(`[QANTUM FORTRESS] ZERO-TICK PAYMENT SUCCESSFUL!`);
            console.log(`Customer: ${customerEmail}`);
            console.log(`Issued Key: ${newKey}`);
            console.log(`======================================================\n`);
            
            // TODO: V2 - Integrate Resend API here to automatically email `newKey` to `customerEmail`.
        }

        return new NextResponse(JSON.stringify({ received: true }), { status: 200 });

    } catch (error: any) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
