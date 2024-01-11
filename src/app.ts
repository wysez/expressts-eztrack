import express, { Application, json, urlencoded } from 'express';
import { initializeOpenIDConnectClient } from '@utils/oidc-client';
import morgan from 'morgan';
import { logger, stream } from '@utils/winston-logger';
import { CREDENTIALS, LOG_FORMAT, ORIGIN, SESSION_SECRET } from '@config';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { router } from './features/routes';

export const createApplicaton = async () => {
  const app = express();

  // Initialize OpenID Connect client
  await initializeOpenIDConnectClient();
  logger.info('  ✅ \t\tOpenID Connect client initialized.');

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
  app.use(morgan(LOG_FORMAT, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: SESSION_SECRET,
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
  app.use('', router);
};
