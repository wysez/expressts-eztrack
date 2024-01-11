import express from 'express';
import { validateEnv } from './core/utils/validate-env';
import { createApplicaton } from './app';
import { logger } from './core/utils/winston-logger';
import { NODE_ENV, PORT } from './core/config';

// validateEnv();

const startServer = async () => {
  try {
    const app = await createApplicaton();
    const port = PORT || 3000;

    app.listen(port, () => {
      logger.info(
        `==================================================================`,
      );

      logger.info(
        `===================== 🚀 Server is running! ======================`,
      );
      logger.info(
        `======================== ENV: ${NODE_ENV} ========================`,
      );
      logger.info(
        `=========================== PORT: ${PORT} ===========================`,
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
