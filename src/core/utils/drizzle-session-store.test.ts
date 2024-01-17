// import { DrizzleSessionStore } from './drizzle-session-store';

import { SessionData } from 'express-session';
import { Session, sessions } from '@database/schema/session';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Session } from 'inspector';
import { DrizzleSessionStore } from './drizzle-session-store';
import { DrizzleInstance } from '../database/drizzle';

// describe('DrizzleSessionStore', () => {
//     let store: DrizzleSessionStore;

//     beforeEach(() => {
//         // Create a new instance of DrizzleSessionStore for each test
//         store = new DrizzleSessionStore({
//             database: /* mock database instance */,
//             ttl: 3600000, // 1 hour
//             autoClearExpiredSessions: true,
//             autoClearExpiredSessionsIntervalMs: 60000, // 1 minute
//         });
//     });

//     afterEach(() => {
//         // Clean up any resources after each test
//         store.clear();
//     });

//     it('should store and retrieve a session', (done) => {
//         const sessionId = 'abc123';
//         const sessionData = { user: { id: 1, name: 'John' } };

//         store.set(sessionId, sessionData, (error) => {
//             expect(error).toBeUndefined();

//             store.get(sessionId, (error, session) => {
//                 expect(error).toBeUndefined();
//                 expect(session).toEqual(sessionData);
//                 done();
//             });
//         });
//     });

//     it('should destroy a session', (done) => {
//         const sessionId = 'abc123';
//         const sessionData = { user: { id: 1, name: 'John' } };

//         store.set(sessionId, sessionData, (error) => {
//             expect(error).toBeUndefined();

//             store.destroy(sessionId, (error) => {
//                 expect(error).toBeUndefined();

//                 store.get(sessionId, (error, session) => {
//                     expect(error).toBeUndefined();
//                     expect(session).toBeUndefined();
//                     done();
//                 });
//             });
//         });
//     });

//     it('should clear all sessions', (done) => {
//         const sessionId1 = 'abc123';
//         const sessionId2 = 'def456';
//         const sessionData = { user: { id: 1, name: 'John' } };

//         store.set(sessionId1, sessionData, (error) => {
//             expect(error).toBeUndefined();

//             store.set(sessionId2, sessionData, (error) => {
//                 expect(error).toBeUndefined();

//                 store.clear((error) => {
//                     expect(error).toBeUndefined();

//                     store.get(sessionId1, (error, session) => {
//                         expect(error).toBeUndefined();
//                         expect(session).toBeUndefined();

//                         store.get(sessionId2, (error, session) => {
//                             expect(error).toBeUndefined();
//                             expect(session).toBeUndefined();
//                             done();
//                         });
//                     });
//                 });
//             });
//         });
//     });

//     // Add more test cases for other methods...

// });

/**
 * Mock Winston logger.
 */
jest.mock('@utils/winston-logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

/**
 * Mock Drizzle instance.
 */
jest.mock('drizzle-orm/node-postgres', () => ({
  NodePgDatabase: jest.fn().mockImplementation(() => ({
    query: {
      sessions: {
        findFirst: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    },
  })),
}));

const createMockSession = (
  id: number,
  sid: string,
  data: object,
  expiresAt: number,
): Session => ({
  id,
  session_id: sid,
  data: JSON.stringify(data),
  expiresAt,
});

const createMockDatabaseResponse = (): Session[] => [
  { id: 1, session_id: '1', data: '{}', expiresAt: new Date().getTime() },
];

describe('DrizzleSessionStore Tests', () => {
  let dbMock: jest.Mocked<NodePgDatabase<{ sessions: typeof sessions }>>;
  let store: DrizzleSessionStore;

  beforeEach(async () => {
    // Create a new instance of DrizzleSessionStore for each test
    dbMock = DrizzleInstance() as unknown as jest.Mocked<
      NodePgDatabase<{ sessions: typeof sessions }>
    >;
    store = new DrizzleSessionStore({
      database: dbMock,
      ttl: 1000 * 10, // 10 seconds
      autoClearExpiredSessions: true,
      autoClearExpiredSessionsIntervalMs: 5000, // 5 seconds
    });
  });

  it('should throw an error if database is not provided', () => {
    expect(() => {
      new DrizzleSessionStore({
        database: undefined,
        ttl: 1000 * 10, // 10 seconds
        autoClearExpiredSessions: true,
        autoClearExpiredSessionsIntervalMs: 5000, // 5 seconds
      });
    }).toThrow('Database instance was not provided to DrizzleSessionStore.');
  });

  it('should create an instance of DrizzleSessionStore with all options provided', () => {
    expect(store).toBeInstanceOf(DrizzleSessionStore);
  });

  // Method tests: all, get, set, touch, destroy, clear, clearExpiredSessions
  describe('Metho: all', () => {
    it('should return all sessions', async () => {
      const mockSessions = [
        createMockSession(1, '1', {}, new Date().getTime() + 10000),
      ];

      dbMock.query.sessions.findFirst.mockResolvedValueOnce(mockSessions);

      await expect(store.all()).resolves.toEqual(createMockDatabaseResponse());
    });
  });
});

/**
 // 1. Setup and Dependencies
// - Import necessary modules: jest, mock functions, DrizzleSessionStore
// - Setup Jest with TypeScript

// 2. Mocking Dependencies
// - Mock database operations (select, delete, insert, update)
// - Mock logger methods

// 3. Test Cases
// - Constructor Tests
//   - Test without database instance
//   - Test with all options provided
// - Method Tests
//   - all: Test getting all sessions, handle success and error
//   - destroy: Test destroying a session, handle success and error
//   - clear: Test clearing all sessions, handle success and error
//   - length: Test getting session count, handle success and error
//   - get: Test getting a specific session, handle success and error
//   - set: Test setting a session, handle success and error
//   - touch: Test touching a session, handle success and error
//   - clearExpiredSessions: Test clearing expired sessions, handle success and error
// - Interval Tests
//   - Test setting and clearing interval for auto-clearing sessions

// 4. Utility Functions
// - Create mock session object
// - Create mock database responses

// 5. Test Execution
// - Configure Jest to run the tests with TypeScript support

 */

/**
 // 1. Setup and Dependencies
import { DrizzleSessionStore } from './utils/drizzle-session-store';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sessions } from '@database/schema/session';
import { logger } from '@utils/winston-logger';
import { Session, Store } from 'express-session';

// 2. Mocking Dependencies
jest.mock('drizzle-orm/node-postgres', () => {
  return {
    NodePgDatabase: jest.fn().mockImplementation(() => ({
      select: jest.fn(),
      delete: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      query: {
        sessions: {
          findFirst: jest.fn()
        }
      }
    }))
  };
});

jest.mock('@utils/winston-logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Utility Functions
const createMockSession = (id: string, data: object, expiresAt: number): any => ({
  session_id: id,
  data: JSON.stringify(data),
  expiresAt
});

// 3. Test Cases
describe('DrizzleSessionStore Tests', () => {
  let dbMock: NodePgDatabase<{ sessions: typeof sessions }>;
  let store: DrizzleSessionStore;

  beforeEach(() => {
    dbMock = new NodePgDatabase() as any;
    store = new DrizzleSessionStore({ database: dbMock });
  });

  // Constructor Tests
  it('should throw error if no database instance is provided', () => {
    expect(() => new DrizzleSessionStore({} as any)).toThrow(Error);
  });

  it('should create an instance with all options provided', () => {
    expect(store).toBeInstanceOf(Store);
  });

  // Method Tests - all, destroy, clear, length, get, set, touch, clearExpiredSessions
  describe('Method: all', () => {
    it('should get all sessions successfully', async () => {
      // Mock database response
      const mockSessions = [createMockSession('1', { user: 'test' }, 1234567890)];
      dbMock.select.mockResolvedValueOnce(mockSessions);
      // Test method
      await expect(store.all()).resolves.toEqual(mockSessions);
    });

    it('should handle errors when getting all sessions', async () => {
      // Mock database error
      dbMock.select.mockRejectedValueOnce(new Error('Database error'));
      // Test method
      await expect(store.all()).rejects.toThrow('Database error');
    });
  });

  // Similar structure for other methods like destroy, clear, length, get, set, touch, and clearExpiredSessions

  // Interval Tests
  describe('Interval Tests', () => {
    jest.useFakeTimers();
    
    it('should set and clear interval for auto-clearing sessions', () => {
      // Test set and clear interval
    });

    jest.useRealTimers();
  });
});

// 4. Additional Jest Configuration for TypeScript if needed

 */
