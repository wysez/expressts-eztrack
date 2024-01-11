// morganConfig.ts
import morgan, { StreamOptions } from 'morgan';
import { logger } from '@utils/winston-logger';

// Stream configuration for morgan
const stream: StreamOptions = {
  write: message => logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

export const morganMiddleware = morgan(
  // Define log format
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  { stream, skip },
);
