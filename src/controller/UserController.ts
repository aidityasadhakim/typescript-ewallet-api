import User, { UserModel } from "../models/UserModels";
import IController from "./ControllerInterface";
import { Request, Response } from "express";

class UserController implements IController {
  show = async (req: Request, res: Response): Promise<Response> => {
    const users = await UserModel.find();
    return res.status(200).json(users);
  };
}

export default new UserController();
