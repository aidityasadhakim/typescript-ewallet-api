import BaseRoute from "./BaseRoute";
import UserController from "../controller/UserController";
import Authorization from "../auth/Authorization";

class UserRoutes extends BaseRoute {
  public routes(): void {
    this.router.get("/", Authorization.authJwt, UserController.show);
  }
}

export default new UserRoutes().router;
