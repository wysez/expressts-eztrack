import { Router } from 'express';
import { authRoutes } from './auth/auth.routes';
import { financesRoutes } from './finances/finances.routes';
import { authenticated } from '@/core/middleware/authenticated.middleware';

export const router = Router();

router.use('/', authRoutes).use('/finances', authenticated, financesRoutes);
