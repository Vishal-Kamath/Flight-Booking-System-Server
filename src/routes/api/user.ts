import { userObject } from './../../schema/user.schema';
import { blankSchema } from './../../schema/blank.schema';
import express from 'express';
import * as userController from '../../controllers/user.controllers';
import validateResources from '../../middleware/validateResources';

const router = express.Router();

router
  .route('/')
  .get(userController.fetchUserDetails)
  .post(
    validateResources(blankSchema, userObject, blankSchema),
    userController.updateUserDetails
  );

export { router };
