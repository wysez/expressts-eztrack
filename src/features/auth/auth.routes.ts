import { Router } from 'express';
import {
  oasigninController,
  oasignoutController,
  pageloadController,
  refreshController,
  signinController,
  signupController,
  userinfoController,
} from './auth.controller';

export const authRoutes = Router();

authRoutes
  .post('/pageload', pageloadController)
  .post('/signin', signinController)
  .post('/signup', signupController)
  .post('/oa/signin', oasigninController)
  .post('/oa/signout', oasignoutController)
  .post('/userinfo', userinfoController)
  .post('/refresh', refreshController);
