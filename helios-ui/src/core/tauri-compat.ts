/**
 * 🌐 TAURI COMPATIBILITY SHIM
 * Provides web-compatible alternatives to Tauri APIs
 */

import { CONFIG } from '../config';

// Check if we're running in Tauri or web mode
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

/**
 * Invoke a backend command
 * In Tauri mode: uses Tauri's invoke
 * In Web mode: uses HTTP API calls
 */
export async function invoke<T>(command: string, args?: Record<string, any>): Promise<T> {
    if (isTauri) {
        // Import dynamically to avoid bundling issues
        const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
        return tauriInvoke<T>(command, args);
    } else {
        // Web mode: use HTTP API with correct endpoint and method
        // Backend Route: POST /api/command/:cmd
        const url = `${CONFIG.API_URL}/api/command/${encodeURIComponent(command)}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: args ? JSON.stringify(args) : '{}'
        });
        
        if (!response.ok) {
            let errorMessage = `Failed to execute command '${command}': HTTP ${response.status}`;
            try {
                const errorBody = await response.text();
                if (errorBody) {
                    errorMessage += ` - ${errorBody}`;
                }
            } catch (e) {
                // Ignore parse errors
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data as T;
    }
}

/**
 * Event handler type for better type safety
 */
export type EventHandler<T = unknown> = (event: { payload: T }) => void;

/**
 * Listen to events
 * In Tauri mode: uses Tauri's event system
 * In Web mode: Currently returns a no-op (events handled via WebSocket in NativeWebSocket)
 * 
 * @note In web mode, most events are received through the WebSocket connection
 * managed by NativeWebSocket. This function is mainly for Tauri compatibility.
 */
export async function listen<T = unknown>(
    event: string, 
    handler: EventHandler<T>
): Promise<() => void> {
    if (isTauri) {
        const { listen: tauriListen } = await import('@tauri-apps/api/event');
        const unlisten = await tauriListen(event, handler as any);
        return unlisten;
    } else {
        // Web mode: Events are handled via WebSocket (see NativeWebSocket.ts)
        // TODO: Implement custom event emitter if needed for non-WebSocket events
        console.debug(`[tauri-compat] Event listener registered for '${event}' (web mode - no-op)`);
        return () => {};
    }
}
