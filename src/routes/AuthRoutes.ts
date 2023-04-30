import AuthController from "../controller/AuthController";
import BaseRoute from "./BaseRoute";

class AuthRoutes extends BaseRoute {
  public routes(): void {
    this.router.post("/login", AuthController.login);

    this.router.post("/register", AuthController.register);
  }
}

export default new AuthRoutes().router;
