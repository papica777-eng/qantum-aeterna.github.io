import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../../telemetry/Logger';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function applyPatchToCodebase(patchContent: string): Promise<void> {
    const logger = Logger.getInstance();
    const patchFileName = `patch-${Date.now()}.diff`;
    const patchFilePath = path.join(process.cwd(), patchFileName);

    try {
        // Write the patch to a file
        await fs.promises.writeFile(patchFilePath, patchContent, 'utf-8');
        logger.info('GIT_PATCHER', `Patch file created at ${patchFilePath}`);

        // Check if there are uncommitted changes
        const { stdout: statusOut } = await execAsync('git status --porcelain');
        const hasUncommittedChanges = statusOut.trim() !== '';

        if (hasUncommittedChanges) {
            logger.warn('GIT_PATCHER', 'Working directory is not clean. Stashing changes before applying patch.');
            await execAsync('git stash push -m "Stash before auto-patch"');
        }

        try {
            // Check if patch applies cleanly
            await execAsync(`git apply --check ${patchFileName}`);
            logger.info('GIT_PATCHER', 'Patch pre-check passed.');

            // Apply the patch
            await execAsync(`git apply ${patchFileName}`);
            logger.info('GIT_PATCHER', 'Patch applied successfully.');

            // Commit only the patched files to ensure atomicity
            // git apply modifies files in the working tree. We can add all modified/deleted tracked files
            await execAsync('git commit -a -m "Auto-applied patch"');
            logger.info('GIT_PATCHER', 'Patch committed successfully.');
        } catch (applyError: any) {
            // Restore working directory on failure
            logger.error('GIT_PATCHER', 'Patch application failed, attempting rollback.', applyError);
            await execAsync('git restore --staged .');
            await execAsync('git restore .');
            throw applyError;
        } finally {
            // Pop stash if we stashed earlier
            if (hasUncommittedChanges) {
                try {
                    await execAsync('git stash pop');
                    logger.info('GIT_PATCHER', 'Restored previously stashed changes.');
                } catch (stashError) {
                    logger.error('GIT_PATCHER', 'Failed to restore stashed changes. They are still in the stash.', stashError);
                }
            }
        }

    } catch (error: any) {
        throw new Error(`[PATCH_APPLICATION_FAILED]: ${error.message}`);
    } finally {
        // Cleanup the patch file
        try {
            if (fs.existsSync(patchFilePath)) {
                await fs.promises.unlink(patchFilePath);
                logger.info('GIT_PATCHER', `Cleaned up patch file ${patchFilePath}`);
            }
        } catch (cleanupError: any) {
            logger.error('GIT_PATCHER', `Failed to clean up patch file ${patchFilePath}`, cleanupError);
        }
    }
}
