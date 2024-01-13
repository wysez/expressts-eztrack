import { Router } from 'express';
import { authRoutes } from './auth/auth.routes';

export const router = Router();

router.use(authRoutes);
