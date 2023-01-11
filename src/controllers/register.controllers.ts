import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import { ReqUserObject } from '../schema/user.schema';
import bcrypt from 'bcrypt';

export const handleRegister = async (
  req: Request<{}, {}, ReqUserObject>,
  res: Response
) => {
  const userAlreadyExists = await UserModel.findOne({
    username: req.body.username,
  });

  // check if user already exists
  if (userAlreadyExists) return res.status(409).send('user already exists'); // Conflict

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // create new user
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      refreshToken: '',
      name: req.body.name,
      email: req.body.email,
      dob: new Date(req.body.dob),
      gender: req.body.gender,
      coins: 10000,
    });

    // save user
    const user = await newUser.save();
    res
      .status(201)
      .send({ message: `success new user ${user.username} was created` });
  } catch (err: any) {
    console.log(err);
    res.status(502).send(err); // Bad Gateway
  }
};
