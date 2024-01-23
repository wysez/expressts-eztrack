import { Request, Response, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DrizzleInstance } from '@database/drizzle';
import { users } from '@database/schema/user';
import { logger } from '@/core/utils/winston-logger';

export const pageloadController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const db = DrizzleInstance();
    const { userid } = request.session;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userid),
    });

    if (!user) {
      return response.status(409).json({
        message: 'User not found',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({
      isAuthenticated: request.session.isAuthenticated,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const signinController = async (
  request: Request,
  response: Response,
) => {
  try {
    const { username, password } = request.body;

    const db = DrizzleInstance();
    const userWithPassword = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!userWithPassword) {
      return response.status(400).json({
        message: 'Profile not located.',
      });
    }

    const doesPasswordMatch = await compare(
      password,
      userWithPassword.password,
    );

    if (!doesPasswordMatch) {
      return response.status(400).json({
        error: { message: 'Incorrect password' },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = userWithPassword;

    request.session.userid = userWithoutPassword.id;
    request.session.isAuthenticated = true;

    return response.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      message: 'Unable to sign in. Please try again later.',
    });
  }
};

export const signupController = async (
  request: Request,
  response: Response,
) => {
  try {
    const db = DrizzleInstance();
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
      zipCode,
    } = request.body;

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (user) {
      return response.status(200).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await hash(password, 10);
    const formattedBirthDate = new Date(birthDate).toLocaleDateString();

    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: formattedBirthDate,
      gender,
      zipCode,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } =
      await db.query.users.findFirst({
        where: eq(users.username, username),
      });

    return response.status(201).json({
      message: 'User created',
      user: userWithoutPassword,
    });
  } catch (error) {
    logger.error(error);

    // Duploicate key value violates unique constraint
    if (error?.code === '23505') {
      return response.status(409).json({
        message: 'User already exists',
      });
    }

    return response.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

export const signoutController = async (
  request: Request,
  response: Response,
) => {
  try {
    request.session.destroy(error => {
      if (error) {
        return response.status(400).json({
          message: 'Unable to sign out. Please try again later.',
        });
      }

      return response.status(200).json({
        message: 'User signed out',
      });
    });
  } catch (error) {
    return response.status(400).json({
      message: 'Unable to sign out. Please try again later.',
    });
  }
};

// export const oasigninController = async (
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) => {};
// export const oasignoutController = async (
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) => {};
export const userinfoController = async (
  request: Request,
  response: Response,
) => {
  try {
    const uid = request.session.userid;

    const db = DrizzleInstance();

    const user = await db.query.users.findFirst({
      where: eq(users.id, uid),
    });

    if (!user) {
      return response.status(400).json({
        message: 'User not found',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return response.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    return response.status(400).json({
      message: 'Unable to get user info. Please try again later.',
    });
  }
};
// export const refreshController = async (
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) => {};
