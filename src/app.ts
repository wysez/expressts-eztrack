import express, { Application, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import { env } from '@config';
import { logger, stream } from '@utils/winston-logger';
import { initializeOpenIDConnectClient } from '@utils/oidc-client';
import {
  DrizzleInstance,
  PostgresqlPool,
  initializeDrizzleInstance,
} from '@database/drizzle';
import { router } from '@features/routes';

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const createApplicaton = async () => {
  const app = express();

  // Initialize OpenID Connect client
  await initializeOpenIDConnectClient()
    .then(() => {
      logger.info('✅ OpenID Connect client initialized.');
    })
    .catch(error =>
      logger.error(`❌ Error while initializing OpenID Client: ${error} `),
    );

  // Initialize Drizzle instance
  await initializeDrizzleInstance()
    .then(() => {
      logger.info('✅ Drizzle instance initialized.');
    })
    .catch(error => {
      logger.error(`❌ Error while initializing Drizzle: ${error}`);
    });

  // Initialize Express middleware
  initializeMiddleware(app);
  logger.info('✅ Express middleware initialized.');

  // Initialize session store
  initializeSessionStore(app);
  logger.info('✅ Session store initialized.');

  // Initialize Express routes
  initializeRoutes(app);
  logger.info('✅ Express routes initialized.');

  logger.info('✅ Application initialized.');
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
};

const initializeSessionStore = (app: Application) => {
  const pgSession = connectPgSimple(session);
  const pgSessionStore = new pgSession({
    pool: PostgresqlPool(),
    createTableIfMissing: true,
    schemaName: 'public',
    tableName: 'session',
    ttl: 60,
    pruneSessionInterval: 3,
    errorLog: logger.error.bind(logger),
  });

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: true,
        maxAge: 1000 * 60 * 30,
      },
      store: pgSessionStore,
    }),
  );
};

const initializeRoutes = (app: Application) => {
  app.use(router);
};
