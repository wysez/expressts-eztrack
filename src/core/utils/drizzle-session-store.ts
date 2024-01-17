/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from 'express-session';
import { countDistinct, eq, gte, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sessions } from '@database/schema/session';
import { logger } from '@utils/winston-logger';

const CLEANUP_INTERVAL = 1000 * 60 * 60;
const DEFAULT_TTL = 1000 * 60 * 60;

interface EventEmitterOptions {
  /**
   * Enables automatic capturing of promise rejection. Default: `false`.
   */
  captureRejections?: boolean;
}

interface Options extends EventEmitterOptions {
  /**
   * Drizzle Database instance. Required.
   */
  database: NodePgDatabase<{ sessions: typeof sessions }>;

  /**
   * Session TTL in milliseconds. Defaults to `1000 * 60 * 60` (1 hour).
   */
  ttl?: number;

  /**
   * Automatically clear expired sessions. Defaults to `true`.
   */
  autoClearExpiredSessions?: boolean;

  autoClearExpiredSessionsIntervalMs?: number;
}

export class DrizzleSessionStore extends Store {
  private readonly database: NodePgDatabase<{ sessions: typeof sessions }>;
  private readonly ttl: number;
  private readonly autoClearExpiredSessionsIntervalMs: number;
  private autoClearIntervalId?: ReturnType<typeof setInterval>;

  constructor(options: Options) {
    super(options);

    if (!options.database) {
      throw new Error(
        'Database instance was not provided to DrizzleSessionStore.',
      );
    }

    this.database = options.database;

    this.ttl = options.ttl;

    this.autoClearExpiredSessionsIntervalMs =
      options.autoClearExpiredSessionsIntervalMs || CLEANUP_INTERVAL;

    if (options.autoClearExpiredSessions) {
      this.setAutoClearExpiredSessionsIntervalMs();
    }
  }

  /**
   * Get all sessions.
   * @param {function} callback
   */
  all = (callback: (error: any, result?: any) => void) => {
    logger.info('Getting all sessions...');
    const preparedQuery = this.database
      .select()
      .from(sessions)
      .prepare('get_sessions');

    preparedQuery
      .execute()
      .then((data: any) => callback(null, data))
      .catch((error: any) => callback(error));
  };

  /**
   * Destroy a session.
   * @param {string} sid
   * @param {function} callback
   */
  destroy = (sid: string, callback?: (err?: any) => void) => {
    logger.info(`Destroying session: ${sid}`);
    const preparedDeleteOne = this.database
      .delete(sessions)
      .where(eq(sessions.session_id, sql.placeholder('sid')))
      .prepare('delete_session');

    preparedDeleteOne
      .execute({ sid })
      .then(() => callback && callback(null))
      .catch(error => callback && callback(error));
  };

  /**
   * Destroy all sessions.
   * @param {function} callback
   */
  clear = (callback?: (err?: any) => void) => {
    logger.info('Clearing all sessions...');
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    const preparedDeleteAll = this.database
      .delete(sessions)
      .prepare('delete_all_sessions');

    preparedDeleteAll
      .execute()
      .then(() => callback && callback(null))
      .catch((error: any) => callback && callback(error));
  };

  /**
   * Get the count of all sessions.
   * @param {function} callback
   */
  length = (callback: (err: any, length?: number) => void) => {
    logger.info('Getting session count...');
    const preparedCountSessions = this.database
      .select({ value: countDistinct(sessions.session_id) })
      .from(sessions)
      .prepare('count_sessions');

    preparedCountSessions
      .execute()
      .then(value => callback(null, value[0].value))
      .catch((error: any) => callback(error, 0));
  };

  /**
   * Get a session.
   * @param {string} sid
   * @param {function} callback
   */
  get = (sid: string, callback: (err: any, session?: any) => void) => {
    logger.info(`Getting session: ${sid}`);
    const preparedGetSession = this.database.query.sessions
      .findFirst({ where: eq(sessions.session_id, sql.placeholder('sid')) })
      .prepare('get_session');

    preparedGetSession
      .execute({ sid })
      .then(session =>
        callback(null, session ? JSON.parse(session.data) : null),
      )
      .catch(error => callback(error));
  };

  /**
   * Set a session.
   * @param {string} sid
   * @param {object} session
   * @param {function} callback
   */
  set = (sid: string, session: any, callback?: (err?: any) => void) => {
    logger.info(`Setting session: ${sid}`);
    const preparedInsertSession = this.database
      .insert(sessions)
      .values({
        session_id: sql.placeholder('sid'),
        expiresAt: sql.placeholder('expiresAt'),
        data: sql.placeholder('data'),
      })
      .prepare('insert_session');

    let data;

    try {
      data = JSON.stringify(session);
    } catch (error) {
      return callback(error);
    }

    const ttl = this.getTTL(session);
    const expiresAt = Math.floor(Date.now() / 1000) + ttl;

    preparedInsertSession
      .execute({ sid, expiresAt, data })
      .then(() => callback && callback(null))
      .catch(error => callback && callback(error));
  };

  /**
   * Touch a session.
   * @param {string} sid
   * @param {object} session
   * @param {function} callback
   */
  touch = (sid: string, session: any, callback?: (err?: any) => void) => {
    logger.info(`Touching session: ${sid}`);
    const preparedUpdateSession = this.database
      .update(sessions)
      .set({ expiresAt: sql.placeholder('expiresAt') as unknown as number })
      .where(eq(sessions.session_id, sql.placeholder('sid')))
      .prepare('update_session');

    const ttl = this.getTTL(session);
    const expiresAt = Math.floor(Date.now() / 1000) + ttl;

    preparedUpdateSession
      .execute({ sid, expiresAt })
      .then(() => callback && callback(null))
      .catch(error => callback && callback(error));
  };

  /**
   * Clear expired sessions.
   * @param {function} callback
   */
  clearExpiredSessions = (callback?: (error: any) => void) => {
    logger.info('Clearing expired sessions...');
    const preparedDeleteExpiredSessions = this.database
      .delete(sessions)
      .where(gte(sessions.expiresAt, sql.placeholder('timestamp')))
      .prepare('delete_expired_sessions');

    const timestamp = Math.floor(Date.now() / 1000);

    preparedDeleteExpiredSessions
      .execute({ timestamp })
      .then(() => callback && callback(null))
      .catch(error => callback && callback(error));
  };

  /**
   * Set auto clear expired sessions interval.
   * @param {number} interval
   */
  setAutoClearExpiredSessionsIntervalMs = (interval?: number) => {
    logger.info('Setting auto clear expired sessions interval...');
    interval = interval || this.autoClearExpiredSessionsIntervalMs;

    this.clearAutoClearExpiredSessionsIntervalMs();
    this.autoClearIntervalId = setInterval(this.clearExpiredSessions, interval);
  };

  /**
   * Clear auto clear expired sessions interval.
   */
  clearAutoClearExpiredSessionsIntervalMs = () => {
    logger.info('Clearing auto clear expired sessions interval...');
    if (this.autoClearIntervalId) {
      clearInterval(this.autoClearIntervalId);
    }

    this.autoClearIntervalId = undefined;
  };

  /**
   * Get session TTL.
   * @param {object} session
   * @returns {number}
   * @private
   */
  private getTTL = (session: any): number => {
    logger.info('Getting session TTL...');
    if (this.ttl) {
      return this.ttl;
    }

    return session.cookie && session.cookie.maxAge
      ? session.cookie.maxAge / 1000
      : DEFAULT_TTL;
  };
}
