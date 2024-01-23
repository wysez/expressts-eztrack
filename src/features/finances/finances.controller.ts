import { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { DrizzleInstance } from '@database/drizzle';
import { logger } from '@utils/winston-logger';
import {
  type InsertBudgetItem,
  budgetItems,
} from '@database/schema/finances-budget-item';
import { users } from '@database/schema/user';
import { getUsersBudgetItems } from './finances.service';

export const getBudgetItemsController = async (
  request: Request,
  response: Response,
) => {
  try {
    const db = DrizzleInstance();

    const result = await getUsersBudgetItems(request.session.userid);

    return response.status(200).json(result);
  } catch (error) {
    return response
      .status(500)
      .json('Unable to fetch budget items. Please try again later.');
  }
};

export const createBudgetItemController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let { title, amount, category } = request.body as {
    title: string;
    amount: string;
    category: string;
  };

  if (typeof parseFloat(amount) !== 'number') {
    return response.status(409).json({ message: "Invalid input for 'amount'" });
  }

  try {
    const db = DrizzleInstance();

    const budgetItem: InsertBudgetItem = {
      userId: request.session.userid,
      title,
      amount,
      category,
    };

    await db
      .insert(budgetItems)
      .values(budgetItem)
      .catch(error => {
        logger.error(error);
      });

    const result = await getUsersBudgetItems(request.session.userid);

    return response
      .status(200)
      .json({ message: 'Successfully added budget item', items: result });
  } catch (error) {
    return response.status(500).json({
      error: 'Unable to add the budget item. Please try again later.',
    });
  }
};
