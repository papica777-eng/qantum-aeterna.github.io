export type SupportedLanguage = 'bg' | 'en' | 'de' | 'fr' | 'cn' | 'jp';
export interface I18nTranslations {
    header: {
        title: string;
        codename: string;
        lines: string;
        tests: string;
        modules: string;
    };
    sidebar: {
        freeFeatures: string;
        proFeatures: string;
        enterprise: string;
        utilities: string;
    };
    modules: {
        websiteAudit: string;
        apiTest: string;
        linkChecker: string;
        predictionMatrix: string;
        apiSensei: string;
        chronosEngine: string;
        thermalPool: string;
        dockerManager: string;
        swarmCommander: string;
        bulgarianTts: string;
        licenseManager: string;
        systemStats: string;
        logger: string;
    };
    badges: {
        free: string;
        pro: string;
        proRequired: string;
    };
    panels: {
        audit: {
            title: string;
            subtitle: string;
            urlLabel: string;
            runButton: string;
            performance: string;
            accessibility: string;
            seo: string;
        };
        apiTest: {
            title: string;
            subtitle: string;
            endpointLabel: string;
            methodLabel: string;
            runButton: string;
        };
        linkChecker: {
            title: string;
            subtitle: string;
            urlLabel: string;
            maxLinksLabel: string;
            runButton: string;
        };
        prediction: {
            title: string;
            subtitle: string;
            codeLabel: string;
            runButton: string;
            description: string;
        };
        apiSensei: {
            title: string;
            subtitle: string;
            baseUrlLabel: string;
            scenariosLabel: string;
            runButton: string;
            scenarios: {
                happyPath: string;
                edgeCases: string;
                errorHandling: string;
                security: string;
                performance: string;
            };
        };
        chronos: {
            title: string;
            subtitle: string;
            description: string;
            intervalLabel: string;
            maxSnapshotsLabel: string;
            runButton: string;
        };
        thermal: {
            title: string;
            subtitle: string;
            description: string;
            states: {
                cool: string;
                warm: string;
                hot: string;
                critical: string;
            };
            temperature: string;
            maxInstances: string;
        };
        docker: {
            title: string;
            subtitle: string;
            description: string;
        };
        swarm: {
            title: string;
            subtitle: string;
            description: string;
        };
        tts: {
            title: string;
            subtitle: string;
            description: string;
            templates: {
                testPassed: string;
                testFailed: string;
                errorFound: string;
                healing: string;
            };
        };
        license: {
            title: string;
            subtitle: string;
            description: string;
            types: {
                trial: string;
                professional: string;
                enterprise: string;
                sovereign: string;
            };
            maxInstances: string;
            features: string;
        };
        stats: {
            title: string;
            subtitle: string;
            version: string;
            linesOfCode: string;
            typescriptFiles: string;
            testsPassing: string;
            enterpriseModules: string;
            codename: string;
        };
        logger: {
            title: string;
            subtitle: string;
            description: string;
        };
    };
    status: {
        systemStatus: string;
        backend: string;
        license: string;
        circuitBreaker: string;
        online: string;
        offline: string;
        closed: string;
        open: string;
        cpuTemperature: string;
        state: string;
        financialOracle: string;
        totalCost: string;
        requests: string;
        budgetLeft: string;
        activityLog: string;
        waitingForActivity: string;
        checking: string;
        freeTier: string;
    };
    common: {
        loading: string;
        processing: string;
        complete: string;
        error: string;
        success: string;
        warning: string;
        opened: string;
        initialized: string;
        madeInBulgaria: string;
    };
    footer: {
        copyright: string;
    };
}
export declare const bg: I18nTranslations;
export declare const en: I18nTranslations;
export declare const de: I18nTranslations;
export declare const fr: I18nTranslations;
export declare const cn: I18nTranslations;
export declare const jp: I18nTranslations;
export declare class I18nManager {
    private currentLanguage;
    private translations;
    private listeners;
    constructor(initialLanguage?: SupportedLanguage);
    /**
     * Get current language
     */
    getLanguage(): SupportedLanguage;
    /**
     * Set language and notify listeners
     */
    setLanguage(lang: SupportedLanguage): void;
    /**
     * Get current translations object
     */
    t(): I18nTranslations;
    /**
     * Get translation by dot-notation path
     * Example: i18n.get('header.title') returns 'QANTUM'
     */
    get(path: string): string;
    /**
     * Subscribe to language changes
     */
    onLanguageChange(callback: (lang: SupportedLanguage) => void): () => void;
    /**
     * Get all supported languages with their display names
     */
    getSupportedLanguages(): Array<{
        code: SupportedLanguage;
        name: string;
        flag: string;
    }>;
    /**
     * Detect browser language and return closest supported language
     */
    detectBrowserLanguage(): SupportedLanguage;
    /**
     * Export translations for use in browser
     */
    static getTranslationsJSON(): string;
}
export declare const i18n: I18nManager;
export declare const translations: {
    bg: I18nTranslations;
    en: I18nTranslations;
    de: I18nTranslations;
    fr: I18nTranslations;
    cn: I18nTranslations;
    jp: I18nTranslations;
};
//# sourceMappingURL=i18n-manager.d.ts.map