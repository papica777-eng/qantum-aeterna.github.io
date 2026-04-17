/**
 * 💰 COMMERCIALIZATION ENGINE - License & Revenue System
 *
 * Complete commercial infrastructure for QANTUM:
 * - Stripe payment integration
 * - License key generation and validation
 * - Customer management
 * - Usage metering and billing
 * - Automatic Docker provisioning for new customers
 *
 * "Turn automation into revenue"
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity
 */
import { EventEmitter } from 'events';
interface CommercializationConfig {
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    licenseServerUrl: string;
    dockerRegistry: string;
    productTiers: ProductTier[];
    trialDays: number;
}
interface ProductTier {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    limits: TierLimits;
    stripePriceIdMonthly: string;
    stripePriceIdYearly: string;
}
interface TierLimits {
    testsPerDay: number;
    parallelWorkers: number;
    retentionDays: number;
    apiCallsPerHour: number;
    swarmRegions: number;
}
interface Customer {
    id: string;
    email: string;
    name: string;
    company?: string;
    tier: string;
    status: 'trial' | 'active' | 'suspended' | 'cancelled';
    licenseKey: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    createdAt: number;
    trialEndsAt?: number;
    currentPeriodEnd?: number;
    usage: UsageMetrics;
}
interface UsageMetrics {
    testsRun: number;
    apiCalls: number;
    storageUsedMB: number;
    lastActivity: number;
}
interface LicenseKey {
    key: string;
    customerId: string;
    tier: string;
    features: string[];
    expiresAt: number;
    checksum: string;
}
interface PaymentEvent {
    type: 'subscription.created' | 'subscription.updated' | 'subscription.deleted' | 'invoice.paid' | 'invoice.failed';
    customerId: string;
    data: Record<string, any>;
    timestamp: number;
}
interface ProvisioningResult {
    success: boolean;
    customerId: string;
    licenseKey: string;
    dockerImage?: string;
    accessUrl?: string;
    error?: string;
}
export declare class CommercializationEngine extends EventEmitter {
    private config;
    private customers;
    private licenses;
    private static readonly DEFAULT_TIERS;
    constructor(config?: Partial<CommercializationConfig>);
    /**
     * 💰 Display commercial dashboard
     */
    showDashboard(): void;
    /**
     * 🎫 Create new customer with trial
     */
    createTrialCustomer(email: string, name: string, company?: string): Promise<Customer>;
    /**
     * 💳 Process Stripe webhook
     */
    processStripeWebhook(payload: string, signature: string): Promise<void>;
    /**
     * Handle subscription created
     */
    private handleSubscriptionCreated;
    /**
     * Handle subscription updated (upgrade/downgrade)
     */
    private handleSubscriptionUpdated;
    /**
     * Handle subscription cancelled
     */
    private handleSubscriptionDeleted;
    /**
     * Handle successful payment
     */
    private handleInvoicePaid;
    /**
     * Handle failed payment
     */
    private handleInvoiceFailed;
    /**
     * 🔑 Generate license key
     */
    private generateLicenseKey;
    /**
     * ✅ Validate license key
     */
    validateLicense(key: string): {
        valid: boolean;
        tier?: string;
        features?: string[];
        error?: string;
    };
    /**
     * 🐳 Provision Docker container for customer
     */
    provisionCustomer(customerId: string): Promise<ProvisioningResult>;
    /**
     * Generate customer-specific docker-compose
     */
    private generateCustomerCompose;
    /**
     * 📊 Get business statistics
     */
    getStats(): {
        totalCustomers: number;
        activeSubscriptions: number;
        trialUsers: number;
        monthlyRevenue: number;
        annualRevenue: number;
    };
    /**
     * Find customer by Stripe ID
     */
    private findCustomerByStripeId;
    /**
     * Load customers from storage
     */
    private loadCustomers;
    /**
     * Save customers to storage
     */
    private saveCustomers;
}
export declare function createCommercializationEngine(config?: Partial<CommercializationConfig>): CommercializationEngine;
export type { Customer, LicenseKey, ProductTier, PaymentEvent };
//# sourceMappingURL=commercialization-engine.d.ts.map