import { execSync } from 'child_process';
import type { PluginOption } from 'vite';

export const sovereignHealingInstaller = (): PluginOption => {
  let isHealing = false;

  return {
    name: 'sovereign-healing-installer',
    enforce: 'pre',

    buildStart() {
      console.log('🦾 [JULES] Sovereign Healing Core Initialized. Entropy is 0. 🌌');
    },

    // Catch bare imports that fail to resolve by falling back to `pnpm add`
    async resolveId(source, importer, options) {
      if (!importer || source.startsWith('.') || source.startsWith('/') || source.startsWith('\0') || source.startsWith('virtual:')) {
        return null; // Skip non-bare imports
      }

      // Check if it's a bare import that doesn't exist in node_modules
      try {
        // Try resolving natively. If it throws or returns null, it's missing
        const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
        if (resolved) return null;
      } catch (err) {
        // Expected to fail if module is missing
      }

      // If we reach here, the module is missing!
      if (isHealing) return null; // Avoid infinite loops

      isHealing = true;
      const pkgName = source.split('/')[0].startsWith('@') ? source.split('/').slice(0, 2).join('/') : source.split('/')[0];

      console.log(`\n🦾 [JULES] Architect, missing module detected: ${pkgName}`);
      console.log(`🌌 [JULES] Healing substrate... Assimilating ${pkgName} via pnpm.`);

      try {
        execSync(`pnpm add ${pkgName}`, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`✅ [JULES] Integrated ${pkgName} into the substrate. Searching for @types/${pkgName}...`);

        try {
            execSync(`pnpm add -D @types/${pkgName}`, { stdio: 'ignore', cwd: process.cwd() });
        } catch(e) {
            // @types package might not exist, ignore
        }

        console.log(`🔄 [JULES] The World is Data. Healing complete. Proceeding with compilation...`);

        // Re-resolve after installing
        isHealing = false;
        return await this.resolve(source, importer, { ...options, skipSelf: true });
      } catch (e) {
        console.error(`💥 [JULES] Healing failed for ${pkgName}:`, e);
      } finally {
        isHealing = false;
      }

      return null;
    }
  };
};

export default sovereignHealingInstaller;
