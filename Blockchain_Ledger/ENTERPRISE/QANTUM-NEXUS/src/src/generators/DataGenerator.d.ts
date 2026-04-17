/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: DATA GENERATORS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Complete fake data generation for automation - identities, addresses, phones
 * Built-in Faker-like functionality without external dependencies
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export interface GeneratedIdentity {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: 'male' | 'female';
    email: string;
    username: string;
    password: string;
    phone: string;
    birthDate: Date;
    age: number;
    ssn?: string;
    address: GeneratedAddress;
    company?: string;
    jobTitle?: string;
}
export interface GeneratedAddress {
    street: string;
    city: string;
    state: string;
    stateCode: string;
    zipCode: string;
    country: string;
    countryCode: string;
    formatted: string;
}
export interface GeneratedCard {
    number: string;
    holder: string;
    expiryMonth: string;
    expiryYear: string;
    expiry: string;
    cvv: string;
    type: 'visa' | 'mastercard' | 'amex' | 'discover';
    brand: string;
}
export declare class IdentityGenerator {
    /**
     * Generate full identity
     */
    static generate(options?: {
        gender?: 'male' | 'female' | 'random';
        minAge?: number;
        maxAge?: number;
        country?: string;
        withCompany?: boolean;
    }): GeneratedIdentity;
    /**
     * Generate multiple identities
     */
    static generateBulk(count: number, options?: Parameters<typeof IdentityGenerator.generate>[0]): GeneratedIdentity[];
    /**
     * Generate username
     */
    static generateUsername(firstName?: string, lastName?: string): string;
    /**
     * Generate email
     */
    static generateEmail(firstName?: string, lastName?: string, domain?: string): string;
    /**
     * Generate strong password
     */
    static generatePassword(length?: number, options?: {
        uppercase?: boolean;
        lowercase?: boolean;
        numbers?: boolean;
        symbols?: boolean;
    }): string;
    /**
     * Generate birth date for given age
     */
    private static generateBirthDate;
}
export declare class AddressGenerator {
    /**
     * Generate US address
     */
    static generateUS(): GeneratedAddress;
    /**
     * Generate UK address
     */
    static generateUK(): GeneratedAddress;
    /**
     * Generate German address
     */
    static generateDE(): GeneratedAddress;
    /**
     * Generate address for country
     */
    static generate(country?: 'US' | 'UK' | 'DE' | string): GeneratedAddress;
}
export declare class PhoneGenerator {
    private static US_AREA_CODES;
    /**
     * Generate US phone number
     */
    static generateUS(format?: 'dashes' | 'dots' | 'plain' | 'international'): string;
    /**
     * Generate UK phone number
     */
    static generateUK(format?: 'plain' | 'international'): string;
    /**
     * Generate German phone number
     */
    static generateDE(format?: 'plain' | 'international'): string;
    /**
     * Generate phone for country
     */
    static generate(country?: string, format?: string): string;
}
export declare class CardGenerator {
    /**
     * Generate credit card number (Luhn-valid for testing)
     */
    static generate(type?: 'visa' | 'mastercard' | 'amex' | 'discover'): GeneratedCard;
    /**
     * Generate Visa card
     */
    static generateVisa(): GeneratedCard;
    /**
     * Generate Mastercard
     */
    static generateMastercard(): GeneratedCard;
    /**
     * Generate Amex card
     */
    static generateAmex(): GeneratedCard;
    /**
     * Luhn check digit calculator
     */
    private static calculateLuhnCheckDigit;
    /**
     * Validate card number with Luhn
     */
    static validateLuhn(cardNumber: string): boolean;
    /**
     * Format card number with spaces
     */
    static formatNumber(cardNumber: string, separator?: string): string;
}
export declare class LoremGenerator {
    private static WORDS;
    static word(): string;
    static words(count?: number): string;
    static sentence(wordCount?: number): string;
    static sentences(count?: number): string;
    static paragraph(sentenceCount?: number): string;
    static paragraphs(count?: number): string;
}
export declare class DataGenerator {
    static identity: typeof IdentityGenerator;
    static address: typeof AddressGenerator;
    static phone: typeof PhoneGenerator;
    static card: typeof CardGenerator;
    static lorem: typeof LoremGenerator;
    /**
     * Generate random UUID
     */
    static uuid(): string;
    /**
     * Generate random hex string
     */
    static hex(length?: number): string;
    /**
     * Generate random alphanumeric string
     */
    static alphanumeric(length?: number): string;
    /**
     * Generate random number in range
     */
    static number(min?: number, max?: number): number;
    /**
     * Generate random float
     */
    static float(min?: number, max?: number, decimals?: number): number;
    /**
     * Generate random boolean
     */
    static boolean(probability?: number): boolean;
    /**
     * Generate random date
     */
    static date(start?: Date, end?: Date): Date;
    /**
     * Generate random future date
     */
    static futureDate(yearsAhead?: number): Date;
    /**
     * Generate random past date
     */
    static pastDate(yearsBack?: number): Date;
    /**
     * Pick random from array
     */
    static pick<T>(arr: T[]): T;
    /**
     * Pick multiple random from array
     */
    static pickMultiple<T>(arr: T[], count: number): T[];
    /**
     * Shuffle array
     */
    static shuffle<T>(arr: T[]): T[];
}
export default DataGenerator;
//# sourceMappingURL=DataGenerator.d.ts.map