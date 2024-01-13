import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcrypt';
import { DrizzleInstance } from '@/core/database/drizzle';
import { users } from '@/core/database/schema/user';
import { logger } from '@/core/utils/winston-logger';
import { inspect } from 'util';

export const pageloadController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const db = DrizzleInstance();
    const { userid } = request.session;

    logger.info(inspect(request.session, false, null, true));

    const user = await db.query.users.findFirst({
      where: eq(users.id, userid),
    });

    if (!user) {
      return response.status(400).json({
        message: 'User not found',
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({
      message: 'User found',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const signinController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response
        .status(400)
        .json({ message: 'Username or password is missing' });
    }

    const db = DrizzleInstance();
    const userWithPassword = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!userWithPassword) {
      return response.status(400).json({
        message: 'User not found',
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

    const { password: _, ...userWithoutPassword } = userWithPassword;

    request.session.userid = userWithoutPassword.id;
    request.session.isAuthenticated = true;

    return response.status(200).json({
      message: 'User found',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const signupController = async (
  request: Request,
  response: Response,
  next: NextFunction,
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

    const requiredFields = [
      username,
      email,
      password,
      firstName,
      lastName,
      birthDate,
      zipCode,
    ];

    if (requiredFields.some(field => !field)) {
    }

    if (typeof username !== 'string' && typeof password !== 'string') {
      response.status(400).json({
        message: 'Username or password is not a string',
      });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user[0]) {
      response.status(200).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await hash(password, 10);
    const formattedBirthDate = new Date(birthDate);

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

    response.status(201).json({
      message: 'User created',
    });
  } catch (error) {
    logger.error(error);
    response.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

export const oasigninController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {};
export const oasignoutController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {};
export const userinfoController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {};
export const refreshController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {};
