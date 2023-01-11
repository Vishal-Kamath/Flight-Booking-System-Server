import express from 'express';
import validateResources from '../../middleware/validateResources';
import { blankSchema } from '../../schema/blank.schema';
import { userObject } from '../../schema/user.schema';
import * as registerController from './../../controllers/register.controllers';

const router = express.Router();

router.post(
  '/',
  validateResources(blankSchema, userObject, blankSchema),
  registerController.handleRegister
);

export { router };
