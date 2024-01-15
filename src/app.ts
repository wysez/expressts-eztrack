import express, { Application, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { env } from '@config';
import { logger, stream } from '@utils/winston-logger';
import { initializeOpenIDConnectClient } from '@utils/oidc-client';
import { DrizzleInstance, initializeDrizzleInstance } from '@database/drizzle';
import { router } from '@features/routes';
import { DrizzleSessionStore } from './core/utils/drizzle-session-store';

export const createApplicaton = async () => {
  const app = express();

  // Initialize OpenID Connect client
  await initializeOpenIDConnectClient();
  logger.info('  ✅ \t\tOpenID Connect client initialized.');

  // Initialize Drizzle instance
  await initializeDrizzleInstance();
  logger.info('  ✅ \t\tDrizzle instance initialized.');

  // Initialize Express middleware
  initializeMiddleware(app);
  logger.info('  ✅ \t\tExpress middleware initialized.');

  // Initialize Express routes
  initializeRoutes(app);
  logger.info('  ✅ \t\tExpress routes initialized.');

  logger.info('  ✅ \t\tApplication initialized.');
  return app;
};

const initializeMiddleware = (app: Application) => {
  app.use(morgan('dev', { stream }));
  app.use(cors({ origin: env.ORIGIN, credentials: env.CREDENTIALS }));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: true,
        maxAge: 1000 * 60 * 60, // 1 hour,
      },
      store: new DrizzleSessionStore(DrizzleInstance()),
    }),
  );
};

const initializeRoutes = (app: Application) => {
  app.use('/', router);
};
