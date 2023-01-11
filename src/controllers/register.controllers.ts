import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import { ReqUserObject } from '../schema/user.schema';

export const handleRegister = async (
  req: Request<{}, {}, ReqUserObject>,
  res: Response
) => {
  const userAlreadyExists = await UserModel.findOne({
    username: req.body.username,
  });

  // check if user already exists
  if (userAlreadyExists) return res.status(409).send('user already exists'); // Conflict

  const newUser = new UserModel({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    dob: new Date(req.body.dob),
    gender: req.body.gender,
    coins: 10000,
  });

  try {
    const user = await newUser.save();
    res.status(200).send(user);
  } catch (err: any) {
    console.log(err);
    res.status(502).send(err); // Bad Gateway
  }
};
