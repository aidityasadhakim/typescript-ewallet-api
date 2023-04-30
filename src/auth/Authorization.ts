import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

class Authorization {
  public authJwt(req: Request, res: Response, next: NextFunction): any {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret: string = `${process.env.JWT_SECRET_KEY}`;
    const token: string | any = req.headers.authorization?.split(" ")[1];

    try {
      const credentials: string | object = jwt.verify(token, secret);

      if (credentials) {
        return next();
      }

      return res.status(401).json({ message: "Invalid token" });
    } catch (err) {
      return res.status(401).json({ message: err });
    }
  }
}

export default new Authorization();
