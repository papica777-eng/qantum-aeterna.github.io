/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: VERIFICATION SERVICES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * SMS, Email, OTP verification handlers for mass automation
 * Supports: SMS-Activate, 5sim, GetSMS, Temp-Mail, Guerrilla Mail
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface SMSProviderConfig {
    provider: 'sms-activate' | '5sim' | 'getsms' | 'sms-man' | 'onlinesim';
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
}
export interface EmailProviderConfig {
    provider: 'temp-mail' | 'guerrilla' | 'mailinator' | '10minutemail' | 'disposable';
    apiKey?: string;
    domain?: string;
}
export interface PhoneNumber {
    id: string;
    number: string;
    country: string;
    operator?: string;
    service?: string;
    cost?: number;
    expiresAt?: Date;
}
export interface SMSMessage {
    id: string;
    from: string;
    text: string;
    code?: string;
    receivedAt: Date;
}
export interface TempEmail {
    id: string;
    address: string;
    domain: string;
    expiresAt?: Date;
}
export interface EmailMessage {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    html?: string;
    receivedAt: Date;
    code?: string;
    link?: string;
}
export interface OTPResult {
    code: string;
    source: 'sms' | 'email' | 'authenticator';
    extractedAt: Date;
}
export declare class SMSVerificationService extends EventEmitter {
    private config;
    private activeNumbers;
    constructor(config: SMSProviderConfig);
    /**
     * Get phone number for service
     */
    getNumber(options: {
        country?: string;
        service: string;
        operator?: string;
    }): Promise<PhoneNumber>;
    /**
     * Wait for SMS with code
     */
    waitForCode(phoneId: string, options?: {
        timeout?: number;
        pattern?: RegExp;
        pollInterval?: number;
    }): Promise<string>;
    /**
     * Release phone number
     */
    releaseNumber(phoneId: string, status?: 'success' | 'cancel' | 'ban'): Promise<void>;
    /**
     * Get balance
     */
    getBalance(): Promise<number>;
    private requestNumber;
    private checkMessages;
    private setNumberStatus;
    private smsActivateRequest;
    private smsActivateBalance;
    private smsActivateGetNumber;
    private smsActivateCheckSms;
    private smsActivateSetStatus;
    private fiveSimRequest;
    private fiveSimBalance;
    private fiveSimGetNumber;
    private fiveSimCheckSms;
    private fiveSimFinish;
    private getSmsRequest;
    private getSmsBalance;
    private getSmsGetNumber;
    private getSmsCheckSms;
    private getCountryCode;
    private sleep;
}
export declare class EmailVerificationService extends EventEmitter {
    private config;
    private activeEmails;
    constructor(config: EmailProviderConfig);
    /**
     * Create temp email
     */
    createEmail(options?: {
        prefix?: string;
        domain?: string;
    }): Promise<TempEmail>;
    /**
     * Wait for verification email
     */
    waitForEmail(emailId: string, options?: {
        timeout?: number;
        fromFilter?: string | RegExp;
        subjectFilter?: string | RegExp;
        pollInterval?: number;
    }): Promise<EmailMessage>;
    /**
     * Extract code from email
     */
    waitForCode(emailId: string, options?: {
        timeout?: number;
        pattern?: RegExp;
        fromFilter?: string | RegExp;
        subjectFilter?: string | RegExp;
    }): Promise<string>;
    /**
     * Extract verification link
     */
    waitForLink(emailId: string, options?: {
        timeout?: number;
        linkPattern?: RegExp;
        fromFilter?: string | RegExp;
        subjectFilter?: string | RegExp;
    }): Promise<string>;
    /**
     * Delete temp email
     */
    deleteEmail(emailId: string): Promise<void>;
    private generateEmail;
    private checkInbox;
    private guerrillaSession;
    private guerrillaRequest;
    private guerrillaCreateEmail;
    private guerrillaCheckInbox;
    private tempMailRequest;
    private tempMailCreateEmail;
    private tempMailCheckInbox;
    private mailinatorRequest;
    private mailinatorCreateEmail;
    private mailinatorCheckInbox;
    private disposableInbox;
    private disposableCreateEmail;
    private disposableCheckInbox;
    /**
     * Simulate receiving email (for testing)
     */
    simulateEmail(emailId: string, message: Partial<EmailMessage>): void;
    private matchesFilter;
    private randomString;
    private md5;
    private sleep;
}
export declare class OTPHandler extends EventEmitter {
    private smsService?;
    private emailService?;
    constructor(options?: {
        sms?: SMSProviderConfig;
        email?: EmailProviderConfig;
    });
    /**
     * Get OTP via SMS
     */
    getSMSOTP(options: {
        service: string;
        country?: string;
        timeout?: number;
        pattern?: RegExp;
    }): Promise<OTPResult & {
        phone: PhoneNumber;
    }>;
    /**
     * Get OTP via Email
     */
    getEmailOTP(options?: {
        timeout?: number;
        pattern?: RegExp;
        fromFilter?: string | RegExp;
        subjectFilter?: string | RegExp;
    }): Promise<OTPResult & {
        email: TempEmail;
    }>;
    /**
     * Get verification link via Email
     */
    getVerificationLink(options?: {
        timeout?: number;
        linkPattern?: RegExp;
        fromFilter?: string | RegExp;
        subjectFilter?: string | RegExp;
    }): Promise<{
        link: string;
        email: TempEmail;
    }>;
    /**
     * Generate TOTP code (Google Authenticator compatible)
     */
    generateTOTP(secret: string, options?: {
        digits?: number;
        period?: number;
        algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    }): string;
    private base32Decode;
}
export declare class VerificationService {
    sms: SMSVerificationService;
    email: EmailVerificationService;
    otp: OTPHandler;
    constructor(config: {
        sms?: SMSProviderConfig;
        email?: EmailProviderConfig;
    });
}
export default VerificationService;
//# sourceMappingURL=VerificationService.d.ts.map