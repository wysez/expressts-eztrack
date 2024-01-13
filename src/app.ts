import express, { Application, json, urlencoded } from 'express';
import { initializeOpenIDConnectClient } from '@utils/oidc-client';
import morgan from 'morgan';
import { logger, stream } from '@utils/winston-logger';
import { env } from '@config';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { router } from './features/routes';
import { initializeDrizzleInstance } from './core/database/drizzle';

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
    }),
  );
};

const initializeRoutes = (app: Application) => {
  app.use('/', router);
};
