/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: FORM AUTOMATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Smart form filling, validation, multi-step forms, data generation
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface FormField {
    name: string;
    selector: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'checkbox' | 'radio' | 'file' | 'textarea';
    label?: string;
    required: boolean;
    validation?: ValidationRule[];
    options?: string[];
    placeholder?: string;
    defaultValue?: string;
}
export interface ValidationRule {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom';
    value?: any;
    message: string;
}
export interface FormData {
    [key: string]: any;
}
export interface FillResult {
    success: boolean;
    fieldsFilled: number;
    errors: FieldError[];
    duration: number;
}
export interface FieldError {
    field: string;
    error: string;
    value?: any;
}
export interface FormStep {
    stepId: string;
    name: string;
    fields: FormField[];
    nextButton?: string;
    prevButton?: string;
    validation?: () => Promise<boolean>;
}
export declare class SmartFormFiller extends EventEmitter {
    private fieldPatterns;
    private dataGenerator;
    constructor();
    /**
     * Auto-detect and fill form
     */
    autoFill(page: any, data?: FormData): Promise<FillResult>;
    /**
     * Fill specific field
     */
    fillField(page: any, field: FormField, value: any): Promise<void>;
    /**
     * Detect form fields on page
     */
    detectFormFields(page: any): Promise<FormField[]>;
    /**
     * Infer value for field
     */
    private inferValue;
    private initializePatterns;
    private formatDate;
}
export declare class FormValidator extends EventEmitter {
    private rules;
    /**
     * Add validation rule for field
     */
    addRule(fieldName: string, rule: ValidationRule): void;
    /**
     * Validate form data
     */
    validate(data: FormData): ValidationResult;
    /**
     * Validate single field
     */
    validateField(fieldName: string, value: any): string[];
    /**
     * Check if form on page is valid
     */
    validateOnPage(page: any, formSelector?: string): Promise<PageValidationResult>;
    private validateRule;
}
interface ValidationResult {
    isValid: boolean;
    errors: Map<string, string[]>;
}
interface PageValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
}
export declare class MultiStepFormHandler extends EventEmitter {
    private steps;
    private currentStepIndex;
    private formData;
    private stepHistory;
    /**
     * Add step to form
     */
    addStep(step: FormStep): void;
    /**
     * Get current step
     */
    getCurrentStep(): FormStep;
    /**
     * Fill current step
     */
    fillCurrentStep(page: any, data: FormData): Promise<FillResult>;
    /**
     * Go to next step
     */
    nextStep(page: any): Promise<boolean>;
    /**
     * Go to previous step
     */
    prevStep(page: any): Promise<boolean>;
    /**
     * Go to specific step
     */
    goToStep(page: any, stepIndex: number): Promise<boolean>;
    /**
     * Submit form
     */
    submit(page: any, submitButton: string): Promise<FormSubmitResult>;
    /**
     * Fill entire multi-step form
     */
    fillEntireForm(page: any, data: FormData): Promise<MultiStepFillResult>;
    /**
     * Get progress
     */
    getProgress(): FormProgress;
}
interface FormSubmitResult {
    success: boolean;
    data: FormData;
    response?: any;
    error?: string;
}
interface StepResult extends FillResult {
    stepId: string;
}
interface MultiStepFillResult {
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    stepResults: StepResult[];
    formData: FormData;
}
interface FormProgress {
    currentStep: number;
    totalSteps: number;
    percentage: number;
    completedFields: number;
}
export declare class FormDataGenerator {
    private firstNames;
    private lastNames;
    private domains;
    private streets;
    private cities;
    private countries;
    private companies;
    /**
     * Generate data for fields
     */
    generateForFields(fields: FormField[]): FormData;
    /**
     * Generate value by field type
     */
    generateByType(type: string, field?: FormField): any;
    firstName(): string;
    lastName(): string;
    fullName(): string;
    email(): string;
    phone(): string;
    address(): string;
    city(): string;
    zipCode(): string;
    country(): string;
    company(): string;
    password(length?: number): string;
    date(start?: Date, end?: Date): string;
    birthDate(): string;
    number(min?: number, max?: number): number;
    boolean(): boolean;
    text(length?: number): string;
    paragraph(sentences?: number): string;
    creditCard(): string;
    cvv(): string;
    expirationDate(): string;
    ssn(): string;
    username(): string;
    url(): string;
    ipAddress(): string;
    uuid(): string;
    private random;
}
export declare class FormTemplateBuilder {
    private fields;
    private name;
    /**
     * Set form name
     */
    setName(name: string): this;
    /**
     * Add text field
     */
    addTextField(name: string, options?: Partial<FormField>): this;
    /**
     * Add email field
     */
    addEmailField(name?: string, options?: Partial<FormField>): this;
    /**
     * Add password field
     */
    addPasswordField(name?: string, options?: Partial<FormField>): this;
    /**
     * Add select field
     */
    addSelectField(name: string, options: string[], fieldOptions?: Partial<FormField>): this;
    /**
     * Add checkbox
     */
    addCheckbox(name: string, options?: Partial<FormField>): this;
    /**
     * Add custom field
     */
    addField(field: FormField): this;
    /**
     * Build template
     */
    build(): FormTemplate;
}
export interface FormTemplate {
    name: string;
    fields: FormField[];
    createdAt: Date;
}
export declare const FORM_TEMPLATES: {
    login: FormTemplate;
    registration: FormTemplate;
    contact: FormTemplate;
    checkout: FormTemplate;
};
export declare function createSmartFormFiller(): SmartFormFiller;
export declare function createFormValidator(): FormValidator;
export declare function createMultiStepHandler(): MultiStepFormHandler;
export declare function createDataGenerator(): FormDataGenerator;
export declare function createTemplateBuilder(): FormTemplateBuilder;
declare const _default: {
    SmartFormFiller: typeof SmartFormFiller;
    FormValidator: typeof FormValidator;
    MultiStepFormHandler: typeof MultiStepFormHandler;
    FormDataGenerator: typeof FormDataGenerator;
    FormTemplateBuilder: typeof FormTemplateBuilder;
    FORM_TEMPLATES: {
        login: FormTemplate;
        registration: FormTemplate;
        contact: FormTemplate;
        checkout: FormTemplate;
    };
    createSmartFormFiller: typeof createSmartFormFiller;
    createFormValidator: typeof createFormValidator;
    createMultiStepHandler: typeof createMultiStepHandler;
    createDataGenerator: typeof createDataGenerator;
    createTemplateBuilder: typeof createTemplateBuilder;
};
export default _default;
//# sourceMappingURL=FormAutomation.d.ts.map