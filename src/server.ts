import express from 'express';
import { createApplicaton } from './app';
import { logger } from './core/utils/winston-logger';
import { env } from './core/config';

// validateEnv();

const startServer = async () => {
  try {
    const app = await createApplicaton();

    app.listen(env.PORT, () => {
      logger.info(
        `==================================================================`,
      );

      logger.info(
        `===================== 🚀 Server is running! ======================`,
      );
      logger.info(
        `======================== ENV: ${env.NODE_ENV} ========================`,
      );
      logger.info(
        `=========================== PORT: ${env.PORT} ===========================`,
      );
      logger.info(
        `==================================================================`,
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
