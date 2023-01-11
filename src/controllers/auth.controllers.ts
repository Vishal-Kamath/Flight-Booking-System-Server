import { ReqUserNamePwd } from '../schema/user.schema';
import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handleAuthentication = async (
  req: Request<{}, {}, ReqUserNamePwd>,
  res: Response
) => {
  const { username, password } = req.body;

  // check if user exists
  const foundUser = await UserModel.findOne({ username: req.body.username });
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    try {
      // create JWT
      // Access Token
      const access_private = process.env.ACCESS_TOKEN_PRIVATE;
      if (!access_private) throw Error('access token private secret not found');

      const accessToken = jwt.sign(
        { username: foundUser.username },
        access_private,
        { algorithm: 'RS256', expiresIn: '15m' }
      );

      // Refresh Token
      const refresh_private = process.env.REFRESH_TOKEN_PRIVATE;
      if (!refresh_private)
        throw Error('refresh token private secret not found');

      const refreshToken = jwt.sign(
        { username: foundUser.username },
        refresh_private,
        { algorithm: 'RS256', expiresIn: '30d' }
      );

      // store refresh token in db
      await UserModel.findOneAndUpdate(
        { username: foundUser.username },
        { refreshToken: refreshToken }
      );

      // create httpOnly cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken });
    } catch (err: any) {
      console.log(err);
      res.sendStatus(500);
    }
  }
};
