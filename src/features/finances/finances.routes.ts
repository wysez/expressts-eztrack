import { Router } from 'express';
import { validate } from '@/core/middleware/validation.middleware';
import { budgetItemSchema } from './finances.zschema';
import {
  createBudgetItemController,
  getBudgetItemsController,
} from './finances.controller';

export const financesRoutes = Router();

financesRoutes
  .get('/budget-items', getBudgetItemsController)
  .post(
    '/budget-items/create',
    validate(budgetItemSchema),
    createBudgetItemController,
  );
