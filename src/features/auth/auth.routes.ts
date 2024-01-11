import { Router } from 'express';

export const authRoutes = Router();

authRoutes
  .post('/pageload')
  .post('/login')
  .post('/logout')
  .post('/userinfo')
  .post('/refresh');
