import { registerAllChainhooks } from '../services/chainhooks.js';
import { logger } from '../utils/logger.js';

async function main() {
    logger.info('🚀 Registering chainhooks...');

    try {
        await registerAllChainhooks();
        logger.info('✅ All chainhooks registered successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Failed to register chainhooks:', error);
        process.exit(1);
    }
}

main();
