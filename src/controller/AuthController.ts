import { Request, Response } from "express";
import User, { UserModel } from "../models/UserModels";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

class AuthController {
  login = async (req: Request, res: Response) => {
    const user = await UserModel.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        user: user,
      });
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token: string = jwt.sign(
        {
          id: user._id,
        },
        `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
  };

  register = async (req: Request, res: Response) => {
    const userId: Promise<User> | unknown = await UserModel.findOne(
      req.body.username
    );

    if (userId) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const user: { name: string; username: string; password: string } = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(
        req.body.password,
        `${process.env.PASSWORD_KEY}`
      ),
    };

    const newUser: User = await UserModel.create(user);

    if (!newUser) {
      return res.status(400).json({
        message: "User not created",
      });
    }

    return res.status(201).json({
      message: "User created",
      user: newUser,
    });
  };
}

export default new AuthController();
