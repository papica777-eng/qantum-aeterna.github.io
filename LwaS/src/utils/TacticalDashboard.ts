import readline from 'readline';

export interface DroneStats {
    symbol: string;
    status: 'WARMING_UP' | 'ACTIVE' | 'IDLE';
    lastPrice: number;
    pnl: number;
    trades: number;
    lastSignal: string;
}

export class TacticalDashboard {
    private stats: Map<string, DroneStats> = new Map();

    public updateDrone(symbol: string, data: Partial<DroneStats>) {
        const current = this.stats.get(symbol) || {
            symbol, status: 'IDLE', lastPrice: 0, pnl: 0, trades: 0, lastSignal: 'N/A'
        };
        this.stats.set(symbol, { ...current, ...data });
    }

    public render() {
        // Move cursor to top instead of clearing to prevent flicker
        process.stdout.write('\x1b[H');

        console.log(`\x1b[35m=== VORTEX HIVE MIND TACTICAL OVERVIEW ===\x1b[0m`);
        console.log(`Time: ${new Date().toLocaleTimeString()} | Status: \x1b[32mOPERATIONAL\x1b[0m`);
        console.log('------------------------------------------------------------');

        const tableData = Array.from(this.stats.values()).map(s => ({
            Symbol: s.symbol,
            Status: s.status === 'ACTIVE' ? `\x1b[32m${s.status}\x1b[0m` : `\x1b[33m${s.status}\x1b[0m`,
            Price: s.lastPrice.toFixed(4),
            'PnL (USDT)': s.pnl >= 0 ? `\x1b[32m+${s.pnl.toFixed(2)}\x1b[0m` : `\x1b[31m${s.pnl.toFixed(2)}\x1b[0m`,
            Trades: s.trades,
            'Last Action': s.lastSignal
        }));

        console.table(tableData);

        console.log('------------------------------------------------------------');
        console.log(`\x1b[33m[CTRL+C] to initiate Emergency Shutdown\x1b[0m`);
    }
}
