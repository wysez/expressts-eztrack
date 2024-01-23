import { DrizzleInstance } from '@database/drizzle';
import { budgetItems } from '@database/schema/finances-budget-item';
import { eq, sql } from 'drizzle-orm';

export const getUsersBudgetItems = async (userId: string) => {
  const db = DrizzleInstance();
  const userBudgetItemQuery = db
    .select()
    .from(budgetItems)
    .where(eq(budgetItems.userId, sql.placeholder('uid')))
    .prepare('users_budget_items');

  return await userBudgetItemQuery.execute({ uid: userId });
};
