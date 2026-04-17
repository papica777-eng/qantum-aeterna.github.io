/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: MOBILE TESTING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Mobile device emulation, device farm integration, responsive testing
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface DeviceDescriptor {
    name: string;
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    defaultBrowserType?: 'chromium' | 'firefox' | 'webkit';
}
export interface MobileConfig {
    device?: string | DeviceDescriptor;
    orientation?: 'portrait' | 'landscape';
    geolocation?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    permissions?: string[];
    offline?: boolean;
    networkConditions?: NetworkConditions;
}
export interface NetworkConditions {
    offline: boolean;
    downloadThroughput: number;
    uploadThroughput: number;
    latency: number;
}
export interface TouchAction {
    type: 'tap' | 'doubleTap' | 'longPress' | 'swipe' | 'pinch' | 'scroll';
    x?: number;
    y?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    scale?: number;
}
export declare const DEVICES: Record<string, DeviceDescriptor>;
export declare const NETWORK_PRESETS: Record<string, NetworkConditions>;
export declare class MobileEmulator extends EventEmitter {
    private page;
    private device;
    private orientation;
    private networkConditions?;
    constructor(page: any, config: MobileConfig);
    /**
     * Apply device emulation
     */
    apply(): Promise<void>;
    /**
     * Rotate device
     */
    rotate(): Promise<void>;
    /**
     * Set network conditions
     */
    setNetworkConditions(conditions: NetworkConditions | string): Promise<void>;
    /**
     * Set geolocation
     */
    setGeolocation(geo: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    }): Promise<void>;
    /**
     * Perform touch action
     */
    touch(action: TouchAction): Promise<void>;
    private tap;
    private doubleTap;
    private longPress;
    private swipe;
    private pinch;
    private scroll;
    private getViewport;
    getDevice(): DeviceDescriptor;
    getOrientation(): 'portrait' | 'landscape';
}
export declare class ResponsiveTester extends EventEmitter {
    private page;
    constructor(page: any);
    /**
     * Test across multiple viewports
     */
    testViewports(url: string, viewports: Array<{
        width: number;
        height: number;
        name?: string;
    }>, assertions: (page: any, viewport: {
        width: number;
        height: number;
    }) => Promise<void>): Promise<ResponsiveTestResult[]>;
    /**
     * Test across all common breakpoints
     */
    testBreakpoints(url: string, assertions: (page: any, viewport: {
        width: number;
        height: number;
    }) => Promise<void>): Promise<ResponsiveTestResult[]>;
    /**
     * Test across all devices
     */
    testDevices(url: string, devices: string[], assertions: (page: any, device: DeviceDescriptor) => Promise<void>): Promise<ResponsiveTestResult[]>;
}
export interface ResponsiveTestResult {
    viewport: {
        width: number;
        height: number;
    };
    name: string;
    device?: DeviceDescriptor;
    passed: boolean;
    errors: string[];
    screenshot?: Buffer;
}
interface Breakpoint {
    name: string;
    viewport: {
        width: number;
        height: number;
    };
}
export declare const BREAKPOINTS: Breakpoint[];
export declare class DeviceFarmClient extends EventEmitter {
    private provider;
    private apiKey;
    private baseUrl;
    constructor(config: {
        provider: 'browserstack' | 'saucelabs' | 'lambdatest' | 'aws';
        apiKey: string;
        username?: string;
    });
    /**
     * Get available devices
     */
    getDevices(): Promise<Array<{
        name: string;
        os: string;
        osVersion: string;
    }>>;
    /**
     * Create remote session
     */
    createSession(capabilities: Record<string, any>): Promise<RemoteSession>;
    /**
     * End session
     */
    endSession(sessionId: string): Promise<void>;
}
export interface RemoteSession {
    id: string;
    provider: string;
    capabilities: Record<string, any>;
    status: 'running' | 'completed' | 'failed';
    startTime: Date;
    endTime?: Date;
}
export declare function createMobileEmulator(page: any, config: MobileConfig): MobileEmulator;
export declare function createResponsiveTester(page: any): ResponsiveTester;
declare const _default: {
    MobileEmulator: typeof MobileEmulator;
    ResponsiveTester: typeof ResponsiveTester;
    DeviceFarmClient: typeof DeviceFarmClient;
    DEVICES: Record<string, DeviceDescriptor>;
    NETWORK_PRESETS: Record<string, NetworkConditions>;
    BREAKPOINTS: Breakpoint[];
    createMobileEmulator: typeof createMobileEmulator;
    createResponsiveTester: typeof createResponsiveTester;
};
export default _default;
//# sourceMappingURL=MobileTesting.d.ts.map