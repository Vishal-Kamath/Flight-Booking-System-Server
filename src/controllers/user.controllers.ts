import { ReqUserObject } from './../schema/user.schema';
import { Response } from 'express';
import { VerifyRequest } from '../middleware/verifyJwt';
import UserModel from '../model/user.model';
import { omit } from 'lodash';

export const fetchUserDetails = async (
  req: VerifyRequest<null, null, null>,
  res: Response
) => {
  const foundUser = await UserModel.findOne({ username: req.username });
  if (!foundUser) return res.sendStatus(404);
  const filterUser = omit(foundUser.toJSON(), 'password', 'refreshToken');
  res.send(filterUser);
};

export const updateUserDetails = async (
  req: VerifyRequest<never, ReqUserObject, never>,
  res: Response
) => {
  const updateUser = {
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    gender: req.body.gender,
  };

  try {
    const user = await UserModel.findOneAndUpdate(
      { username: req.username },
      updateUser,
      { new: true }
    );
    if (!user) throw Error('could not update user');
    const filterUser = omit(user.toJSON(), 'password', 'refreshToken');
    res.send(filterUser);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};
