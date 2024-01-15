import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SessionData, Store } from 'express-session';
import { sessions } from '../database/schema/session';
import { eq } from 'drizzle-orm';
import { logger } from './winston-logger';

export class DrizzleSessionStore extends Store {
  private db: NodePgDatabase<{ sessions: typeof sessions }>;

  constructor(db: NodePgDatabase<{ sessions: typeof sessions }>) {
    super();
    this.db = db;
  }

  async get(
    sid: string,
    callback: (err: unknown, session?: SessionData) => void,
  ): Promise<void> {
    try {
      const session = await this.db.query.sessions.findFirst({
        where: eq(sessions.session_id, sid),
      });

      logger.info(`GET session: ${JSON.stringify(session)}`);

      return callback(null, session ? JSON.parse(session.data) : null);
    } catch (error) {
      return callback(error);
    }
  }

  async set(
    sid: string,
    session: SessionData,
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    try {
      const existingSession = await this.db.query.sessions.findFirst({
        where: eq(sessions.session_id, sid),
      });

      if (existingSession) {
        await this.db
          .update(sessions)
          .set({ data: JSON.stringify(session) })
          .where(eq(sessions.session_id, sid));
      } else {
        await this.db
          .insert(sessions)
          .values({
            session_id: sid,
            data: JSON.stringify(session),
          })
          .execute();
      }

      logger.info(`SET session: ${JSON.stringify(session)}`);

      return callback();
    } catch (error) {
      return callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: unknown) => void) {
    try {
      await this.db.delete(sessions).where(eq(sessions.session_id, sid));

      logger.info(`DESTROY session: ${sid}`);

      return callback();
    } catch (error) {
      return callback(error);
    }
  }
}
