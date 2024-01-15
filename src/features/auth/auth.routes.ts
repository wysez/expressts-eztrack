import { Router } from 'express';
import {
  pageloadController,
  signinController,
  signupController,
  signoutController,
  userinfoController,
} from './auth.controller';
import { validate } from '@/core/middleware/validation.middleware';
import { signinSchema, signupSchema } from './auth.zschema';

export const authRoutes = Router();

authRoutes
  .post('/pageload', pageloadController)
  .post('/signin', validate(signinSchema), signinController)
  .post('/signup', validate(signupSchema), signupController)
  .post('/signout', signoutController)
  .get('/userinfo', userinfoController);
// .post('/oa/signin', oasigninController)
// .post('/oa/signout', oasignoutController)
// .post('/userinfo', userinfoController)
// .post('/refresh', refreshController);
