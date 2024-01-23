import { logger } from '@utils/winston-logger';
import { Logger } from 'drizzle-orm';

export class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const table = query.split('from')[1];
    logger.info(`Query: ${query} | Table: ${table}`);
  }
}
