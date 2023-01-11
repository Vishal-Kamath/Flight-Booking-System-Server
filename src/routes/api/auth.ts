import express from 'express';
import validateResources from '../../middleware/validateResources';
import { blankSchema } from '../../schema/blank.schema';
import { userNamePwd } from '../../schema/user.schema';
import * as authController from '../../controllers/auth.controllers';

const router = express.Router();

router.post(
  '/',
  validateResources(blankSchema, userNamePwd, blankSchema),
  authController.handleAuthentication
);

export { router };
