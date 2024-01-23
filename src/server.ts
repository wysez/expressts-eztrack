import { createApplicaton } from './app';
import { logger } from './core/utils/winston-logger';
import { env } from './core/config';
import { closeDrizzleInstance } from './core/database/drizzle';

const startServer = async () => {
  try {
    const app = await createApplicaton();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server listening @ port ${env.PORT}.`);
    });
  } catch (error) {
    console.error(`❌ Error starting server: ${error}`);

    // Clean up database connections, etc.
    await closeDrizzleInstance();

    console.debug('❗ Closed existing database connectins');
  }
};

startServer();
