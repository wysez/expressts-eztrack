import { z } from 'zod';

export const budgetItemSchema = z.object({
  title: z.string().min(1),
  amount: z.string().refine(amount => {
    return parseFloat(amount);
  }),
  category: z.string().min(1),
});
