import { Request, Response } from "express";

interface IController {
  show(req: Request, res: Response): Promise<Response>;
  create?(req: Request, res: Response): Response;
  update?(req: Request, res: Response): Response;
  delete?(req: Request, res: Response): Response;
}

export default IController;
