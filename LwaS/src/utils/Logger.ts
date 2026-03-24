export class Logger {
    private static instance: Logger;

    private constructor() {
        // Private constructor for singleton
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public info(category: string, message: string, metadata?: any): void {
        console.log(`\x1b[36m[${category}]\x1b[0m ${message}`, metadata || '');
    }

    public error(category: string, message: string, error?: any): void {
        console.error(`\x1b[31m[${category}]\x1b[0m ${message}`, error || '');
    }

    public warn(category: string, message: string, metadata?: any): void {
        console.warn(`\x1b[33m[${category}]\x1b[0m ${message}`, metadata || '');
    }

    public debug(category: string, message: string, metadata?: any): void {
        if (process.env.DEBUG) {
            console.log(`\x1b[90m[${category}]\x1b[0m ${message}`, metadata || '');
        }
    }

    public critical(category: string, message: string, error?: any): void {
        console.error(`\x1b[41m\x1b[37m[CRITICAL:${category}]\x1b[0m ${message}`, error || '');
    }
}

// Export singleton instance as default
export default Logger.getInstance();
