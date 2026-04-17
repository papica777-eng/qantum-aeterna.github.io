"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORM_TEMPLATES = exports.FormTemplateBuilder = exports.FormDataGenerator = exports.MultiStepFormHandler = exports.FormValidator = exports.SmartFormFiller = void 0;
exports.createSmartFormFiller = createSmartFormFiller;
exports.createFormValidator = createFormValidator;
exports.createMultiStepHandler = createMultiStepHandler;
exports.createDataGenerator = createDataGenerator;
exports.createTemplateBuilder = createTemplateBuilder;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// SMART FORM FILLER
// ═══════════════════════════════════════════════════════════════════════════════
class SmartFormFiller extends events_1.EventEmitter {
    fieldPatterns = new Map();
    dataGenerator;
    constructor() {
        super();
        this.dataGenerator = new FormDataGenerator();
        this.initializePatterns();
    }
    /**
     * Auto-detect and fill form
     */
    async autoFill(page, data) {
        const startTime = Date.now();
        const errors = [];
        let fieldsFilled = 0;
        try {
            // Detect form fields
            const fields = await this.detectFormFields(page);
            this.emit('fieldsDetected', fields);
            // Generate data if not provided
            const fillData = data || this.dataGenerator.generateForFields(fields);
            // Fill each field
            for (const field of fields) {
                try {
                    const value = fillData[field.name] || this.inferValue(field);
                    await this.fillField(page, field, value);
                    fieldsFilled++;
                    this.emit('fieldFilled', { field: field.name, value });
                }
                catch (error) {
                    errors.push({
                        field: field.name,
                        error: error.message,
                        value: fillData[field.name]
                    });
                }
            }
            return {
                success: errors.length === 0,
                fieldsFilled,
                errors,
                duration: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                fieldsFilled,
                errors: [{ field: 'form', error: error.message }],
                duration: Date.now() - startTime
            };
        }
    }
    /**
     * Fill specific field
     */
    async fillField(page, field, value) {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'tel':
            case 'number':
                await element.clear();
                await element.fill(String(value));
                break;
            case 'textarea':
                await element.clear();
                await element.fill(String(value));
                break;
            case 'select':
                await element.selectOption(value);
                break;
            case 'checkbox':
                if (value && !(await element.isChecked())) {
                    await element.check();
                }
                else if (!value && (await element.isChecked())) {
                    await element.uncheck();
                }
                break;
            case 'radio':
                await page.locator(`${field.selector}[value="${value}"]`).check();
                break;
            case 'file':
                await element.setInputFiles(value);
                break;
            case 'date':
                await element.fill(this.formatDate(value));
                break;
            default:
                await element.fill(String(value));
        }
    }
    /**
     * Detect form fields on page
     */
    async detectFormFields(page) {
        return page.evaluate(() => {
            const fields = [];
            // Find all input elements
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach((el) => {
                const name = el.name || el.id || '';
                if (!name)
                    return;
                let type = el.type || 'text';
                if (el.tagName === 'SELECT')
                    type = 'select';
                if (el.tagName === 'TEXTAREA')
                    type = 'textarea';
                const label = document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() || '';
                const field = {
                    name,
                    selector: el.id ? `#${el.id}` : `[name="${name}"]`,
                    type,
                    label,
                    required: el.required,
                    placeholder: el.placeholder
                };
                if (type === 'select') {
                    field.options = Array.from(el.options).map((o) => o.value);
                }
                fields.push(field);
            });
            return fields;
        });
    }
    /**
     * Infer value for field
     */
    inferValue(field) {
        // Check patterns
        for (const [pattern, config] of this.fieldPatterns) {
            if (field.name.toLowerCase().includes(pattern) ||
                field.label?.toLowerCase().includes(pattern)) {
                return config.generator();
            }
        }
        // Default by type
        return this.dataGenerator.generateByType(field.type);
    }
    initializePatterns() {
        this.fieldPatterns.set('email', {
            generator: () => this.dataGenerator.email()
        });
        this.fieldPatterns.set('phone', {
            generator: () => this.dataGenerator.phone()
        });
        this.fieldPatterns.set('tel', {
            generator: () => this.dataGenerator.phone()
        });
        this.fieldPatterns.set('name', {
            generator: () => this.dataGenerator.fullName()
        });
        this.fieldPatterns.set('first', {
            generator: () => this.dataGenerator.firstName()
        });
        this.fieldPatterns.set('last', {
            generator: () => this.dataGenerator.lastName()
        });
        this.fieldPatterns.set('address', {
            generator: () => this.dataGenerator.address()
        });
        this.fieldPatterns.set('city', {
            generator: () => this.dataGenerator.city()
        });
        this.fieldPatterns.set('zip', {
            generator: () => this.dataGenerator.zipCode()
        });
        this.fieldPatterns.set('postal', {
            generator: () => this.dataGenerator.zipCode()
        });
        this.fieldPatterns.set('country', {
            generator: () => this.dataGenerator.country()
        });
        this.fieldPatterns.set('company', {
            generator: () => this.dataGenerator.company()
        });
        this.fieldPatterns.set('password', {
            generator: () => this.dataGenerator.password()
        });
        this.fieldPatterns.set('date', {
            generator: () => this.dataGenerator.date()
        });
        this.fieldPatterns.set('birth', {
            generator: () => this.dataGenerator.birthDate()
        });
    }
    formatDate(value) {
        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }
        return String(value);
    }
}
exports.SmartFormFiller = SmartFormFiller;
// ═══════════════════════════════════════════════════════════════════════════════
// FORM VALIDATOR
// ═══════════════════════════════════════════════════════════════════════════════
class FormValidator extends events_1.EventEmitter {
    rules = new Map();
    /**
     * Add validation rule for field
     */
    addRule(fieldName, rule) {
        if (!this.rules.has(fieldName)) {
            this.rules.set(fieldName, []);
        }
        this.rules.get(fieldName).push(rule);
    }
    /**
     * Validate form data
     */
    validate(data) {
        const errors = new Map();
        let isValid = true;
        for (const [fieldName, rules] of this.rules) {
            const value = data[fieldName];
            const fieldErrors = [];
            for (const rule of rules) {
                const error = this.validateRule(value, rule);
                if (error) {
                    fieldErrors.push(error);
                    isValid = false;
                }
            }
            if (fieldErrors.length > 0) {
                errors.set(fieldName, fieldErrors);
            }
        }
        return { isValid, errors };
    }
    /**
     * Validate single field
     */
    validateField(fieldName, value) {
        const rules = this.rules.get(fieldName) || [];
        const errors = [];
        for (const rule of rules) {
            const error = this.validateRule(value, rule);
            if (error)
                errors.push(error);
        }
        return errors;
    }
    /**
     * Check if form on page is valid
     */
    async validateOnPage(page, formSelector = 'form') {
        return page.evaluate((selector) => {
            const form = document.querySelector(selector);
            if (!form)
                return { isValid: false, errors: { form: ['Form not found'] } };
            const errors = {};
            let isValid = true;
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach((input) => {
                if (!input.checkValidity()) {
                    isValid = false;
                    const name = input.name || input.id || 'unknown';
                    errors[name] = [input.validationMessage];
                }
            });
            return { isValid, errors };
        }, formSelector);
    }
    validateRule(value, rule) {
        switch (rule.type) {
            case 'required':
                if (!value || (typeof value === 'string' && !value.trim())) {
                    return rule.message;
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return rule.message;
                }
                break;
            case 'minLength':
                if (value && String(value).length < rule.value) {
                    return rule.message;
                }
                break;
            case 'maxLength':
                if (value && String(value).length > rule.value) {
                    return rule.message;
                }
                break;
            case 'pattern':
                if (value && !new RegExp(rule.value).test(value)) {
                    return rule.message;
                }
                break;
            case 'min':
                if (value !== undefined && Number(value) < rule.value) {
                    return rule.message;
                }
                break;
            case 'max':
                if (value !== undefined && Number(value) > rule.value) {
                    return rule.message;
                }
                break;
            case 'custom':
                if (typeof rule.value === 'function' && !rule.value(value)) {
                    return rule.message;
                }
                break;
        }
        return null;
    }
}
exports.FormValidator = FormValidator;
// ═══════════════════════════════════════════════════════════════════════════════
// MULTI-STEP FORM HANDLER
// ═══════════════════════════════════════════════════════════════════════════════
class MultiStepFormHandler extends events_1.EventEmitter {
    steps = [];
    currentStepIndex = 0;
    formData = {};
    stepHistory = [];
    /**
     * Add step to form
     */
    addStep(step) {
        this.steps.push(step);
    }
    /**
     * Get current step
     */
    getCurrentStep() {
        return this.steps[this.currentStepIndex];
    }
    /**
     * Fill current step
     */
    async fillCurrentStep(page, data) {
        const step = this.getCurrentStep();
        const filler = new SmartFormFiller();
        // Filter data for current step fields
        const stepData = {};
        for (const field of step.fields) {
            if (data[field.name] !== undefined) {
                stepData[field.name] = data[field.name];
            }
        }
        const result = await filler.autoFill(page, stepData);
        if (result.success) {
            Object.assign(this.formData, stepData);
            this.emit('stepFilled', { stepId: step.stepId, data: stepData });
        }
        return result;
    }
    /**
     * Go to next step
     */
    async nextStep(page) {
        const step = this.getCurrentStep();
        // Validate current step if validation exists
        if (step.validation) {
            const isValid = await step.validation();
            if (!isValid) {
                this.emit('validationFailed', { stepId: step.stepId });
                return false;
            }
        }
        // Click next button if exists
        if (step.nextButton) {
            await page.click(step.nextButton);
            await page.waitForLoadState('networkidle');
        }
        // Move to next step
        if (this.currentStepIndex < this.steps.length - 1) {
            this.stepHistory.push(this.currentStepIndex);
            this.currentStepIndex++;
            this.emit('stepChanged', {
                from: this.currentStepIndex - 1,
                to: this.currentStepIndex
            });
            return true;
        }
        return false;
    }
    /**
     * Go to previous step
     */
    async prevStep(page) {
        const step = this.getCurrentStep();
        if (step.prevButton) {
            await page.click(step.prevButton);
            await page.waitForLoadState('networkidle');
        }
        if (this.stepHistory.length > 0) {
            const prevIndex = this.stepHistory.pop();
            this.currentStepIndex = prevIndex;
            this.emit('stepChanged', {
                from: this.currentStepIndex + 1,
                to: this.currentStepIndex
            });
            return true;
        }
        return false;
    }
    /**
     * Go to specific step
     */
    async goToStep(page, stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            return false;
        }
        this.stepHistory.push(this.currentStepIndex);
        this.currentStepIndex = stepIndex;
        this.emit('stepChanged', { to: stepIndex });
        return true;
    }
    /**
     * Submit form
     */
    async submit(page, submitButton) {
        try {
            await page.click(submitButton);
            // Wait for response
            const response = await page.waitForResponse((res) => res.status() === 200 || res.status() === 201, { timeout: 10000 }).catch(() => null);
            const success = response !== null;
            this.emit('formSubmitted', { success, data: this.formData });
            return {
                success,
                data: this.formData,
                response: response ? await response.json().catch(() => null) : null
            };
        }
        catch (error) {
            this.emit('submitError', error);
            return {
                success: false,
                data: this.formData,
                error: error.message
            };
        }
    }
    /**
     * Fill entire multi-step form
     */
    async fillEntireForm(page, data) {
        const results = [];
        // Reset to first step
        this.currentStepIndex = 0;
        this.formData = {};
        this.stepHistory = [];
        for (let i = 0; i < this.steps.length; i++) {
            const fillResult = await this.fillCurrentStep(page, data);
            results.push({
                stepId: this.getCurrentStep().stepId,
                ...fillResult
            });
            if (!fillResult.success) {
                return {
                    success: false,
                    completedSteps: i,
                    totalSteps: this.steps.length,
                    stepResults: results,
                    formData: this.formData
                };
            }
            // Move to next step (except for last)
            if (i < this.steps.length - 1) {
                const moved = await this.nextStep(page);
                if (!moved)
                    break;
            }
        }
        return {
            success: true,
            completedSteps: this.steps.length,
            totalSteps: this.steps.length,
            stepResults: results,
            formData: this.formData
        };
    }
    /**
     * Get progress
     */
    getProgress() {
        return {
            currentStep: this.currentStepIndex,
            totalSteps: this.steps.length,
            percentage: ((this.currentStepIndex + 1) / this.steps.length) * 100,
            completedFields: Object.keys(this.formData).length
        };
    }
}
exports.MultiStepFormHandler = MultiStepFormHandler;
// ═══════════════════════════════════════════════════════════════════════════════
// FORM DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
class FormDataGenerator {
    firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Emma'];
    lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com', 'test.com'];
    streets = ['Main St', 'Oak Ave', 'Elm St', 'Park Blvd', 'Cedar Ln', 'Pine Rd', 'Maple Dr', 'Washington Ave'];
    cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Brazil'];
    companies = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Co', 'Wayne Enterprises', 'Stark Industries'];
    /**
     * Generate data for fields
     */
    generateForFields(fields) {
        const data = {};
        for (const field of fields) {
            data[field.name] = this.generateByType(field.type, field);
        }
        return data;
    }
    /**
     * Generate value by field type
     */
    generateByType(type, field) {
        switch (type) {
            case 'email':
                return this.email();
            case 'password':
                return this.password();
            case 'tel':
                return this.phone();
            case 'number':
                return this.number(1, 100);
            case 'date':
                return this.date();
            case 'checkbox':
                return this.boolean();
            case 'select':
                return field?.options?.[0] || '';
            case 'radio':
                return field?.options?.[0] || '';
            default:
                return this.text();
        }
    }
    // Basic generators
    firstName() {
        return this.random(this.firstNames);
    }
    lastName() {
        return this.random(this.lastNames);
    }
    fullName() {
        return `${this.firstName()} ${this.lastName()}`;
    }
    email() {
        const name = `${this.firstName().toLowerCase()}${this.number(1, 99)}`;
        return `${name}@${this.random(this.domains)}`;
    }
    phone() {
        return `+1${this.number(200, 999)}${this.number(100, 999)}${this.number(1000, 9999)}`;
    }
    address() {
        return `${this.number(100, 9999)} ${this.random(this.streets)}`;
    }
    city() {
        return this.random(this.cities);
    }
    zipCode() {
        return String(this.number(10000, 99999));
    }
    country() {
        return this.random(this.countries);
    }
    company() {
        return this.random(this.companies);
    }
    password(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    date(start, end) {
        const startDate = start || new Date(1970, 0, 1);
        const endDate = end || new Date();
        const timestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        return new Date(timestamp).toISOString().split('T')[0];
    }
    birthDate() {
        const start = new Date(1950, 0, 1);
        const end = new Date(2005, 0, 1);
        return this.date(start, end);
    }
    number(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    boolean() {
        return Math.random() > 0.5;
    }
    text(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    paragraph(sentences = 3) {
        const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do'];
        const result = [];
        for (let i = 0; i < sentences; i++) {
            const sentenceLength = this.number(5, 12);
            const sentence = [];
            for (let j = 0; j < sentenceLength; j++) {
                sentence.push(this.random(words));
            }
            sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
            result.push(sentence.join(' ') + '.');
        }
        return result.join(' ');
    }
    // Specialized generators
    creditCard() {
        let card = '4'; // Visa prefix
        for (let i = 0; i < 15; i++) {
            card += Math.floor(Math.random() * 10);
        }
        return card;
    }
    cvv() {
        return String(this.number(100, 999));
    }
    expirationDate() {
        const month = String(this.number(1, 12)).padStart(2, '0');
        const year = this.number(24, 30);
        return `${month}/${year}`;
    }
    ssn() {
        return `${this.number(100, 999)}-${this.number(10, 99)}-${this.number(1000, 9999)}`;
    }
    username() {
        return `${this.firstName().toLowerCase()}${this.number(1, 999)}`;
    }
    url() {
        return `https://www.${this.text(8).toLowerCase()}.com`;
    }
    ipAddress() {
        return `${this.number(1, 255)}.${this.number(0, 255)}.${this.number(0, 255)}.${this.number(1, 255)}`;
    }
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
exports.FormDataGenerator = FormDataGenerator;
// ═══════════════════════════════════════════════════════════════════════════════
// FORM TEMPLATE BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
class FormTemplateBuilder {
    fields = [];
    name = '';
    /**
     * Set form name
     */
    setName(name) {
        this.name = name;
        return this;
    }
    /**
     * Add text field
     */
    addTextField(name, options = {}) {
        this.fields.push({
            name,
            selector: options.selector || `[name="${name}"]`,
            type: 'text',
            required: options.required ?? false,
            ...options
        });
        return this;
    }
    /**
     * Add email field
     */
    addEmailField(name = 'email', options = {}) {
        this.fields.push({
            name,
            selector: options.selector || `[name="${name}"]`,
            type: 'email',
            required: options.required ?? true,
            validation: [
                { type: 'email', message: 'Invalid email format' }
            ],
            ...options
        });
        return this;
    }
    /**
     * Add password field
     */
    addPasswordField(name = 'password', options = {}) {
        this.fields.push({
            name,
            selector: options.selector || `[name="${name}"]`,
            type: 'password',
            required: options.required ?? true,
            validation: [
                { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
            ],
            ...options
        });
        return this;
    }
    /**
     * Add select field
     */
    addSelectField(name, options, fieldOptions = {}) {
        this.fields.push({
            name,
            selector: fieldOptions.selector || `[name="${name}"]`,
            type: 'select',
            required: fieldOptions.required ?? false,
            options,
            ...fieldOptions
        });
        return this;
    }
    /**
     * Add checkbox
     */
    addCheckbox(name, options = {}) {
        this.fields.push({
            name,
            selector: options.selector || `[name="${name}"]`,
            type: 'checkbox',
            required: options.required ?? false,
            ...options
        });
        return this;
    }
    /**
     * Add custom field
     */
    addField(field) {
        this.fields.push(field);
        return this;
    }
    /**
     * Build template
     */
    build() {
        return {
            name: this.name,
            fields: [...this.fields],
            createdAt: new Date()
        };
    }
}
exports.FormTemplateBuilder = FormTemplateBuilder;
// ═══════════════════════════════════════════════════════════════════════════════
// PRESET FORM TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
exports.FORM_TEMPLATES = {
    login: new FormTemplateBuilder()
        .setName('Login Form')
        .addEmailField('email', { label: 'Email Address' })
        .addPasswordField('password', { label: 'Password' })
        .addCheckbox('remember', { label: 'Remember me' })
        .build(),
    registration: new FormTemplateBuilder()
        .setName('Registration Form')
        .addTextField('firstName', { label: 'First Name', required: true })
        .addTextField('lastName', { label: 'Last Name', required: true })
        .addEmailField('email', { label: 'Email Address' })
        .addPasswordField('password', { label: 'Password' })
        .addPasswordField('confirmPassword', { label: 'Confirm Password' })
        .addCheckbox('terms', { label: 'I agree to terms', required: true })
        .build(),
    contact: new FormTemplateBuilder()
        .setName('Contact Form')
        .addTextField('name', { label: 'Your Name', required: true })
        .addEmailField('email', { label: 'Email Address' })
        .addTextField('subject', { label: 'Subject' })
        .addField({
        name: 'message',
        selector: '[name="message"]',
        type: 'textarea',
        label: 'Message',
        required: true
    })
        .build(),
    checkout: new FormTemplateBuilder()
        .setName('Checkout Form')
        .addTextField('firstName', { label: 'First Name', required: true })
        .addTextField('lastName', { label: 'Last Name', required: true })
        .addEmailField('email')
        .addTextField('address', { label: 'Address', required: true })
        .addTextField('city', { label: 'City', required: true })
        .addTextField('zip', { label: 'ZIP Code', required: true })
        .addSelectField('country', ['US', 'CA', 'UK', 'AU', 'DE', 'FR'])
        .addTextField('cardNumber', { label: 'Card Number', required: true })
        .addTextField('expiry', { label: 'Expiration Date', required: true })
        .addTextField('cvv', { label: 'CVV', required: true })
        .build()
};
// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function createSmartFormFiller() {
    return new SmartFormFiller();
}
function createFormValidator() {
    return new FormValidator();
}
function createMultiStepHandler() {
    return new MultiStepFormHandler();
}
function createDataGenerator() {
    return new FormDataGenerator();
}
function createTemplateBuilder() {
    return new FormTemplateBuilder();
}
exports.default = {
    SmartFormFiller,
    FormValidator,
    MultiStepFormHandler,
    FormDataGenerator,
    FormTemplateBuilder,
    FORM_TEMPLATES: exports.FORM_TEMPLATES,
    createSmartFormFiller,
    createFormValidator,
    createMultiStepHandler,
    createDataGenerator,
    createTemplateBuilder
};
//# sourceMappingURL=FormAutomation.js.map