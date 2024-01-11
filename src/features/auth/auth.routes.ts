import { Router } from 'express';
import { login, logout, pageload, refresh, userinfo } from './auth.controller';

export const authRoutes = Router();

authRoutes
  .post('/pageload', pageload)
  .post('/login', login)
  .post('/logout', logout)
  .post('/userinfo', userinfo)
  .post('/refresh', refresh);
