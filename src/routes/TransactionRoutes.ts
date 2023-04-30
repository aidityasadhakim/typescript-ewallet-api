import BaseRoute from "./BaseRoute";
import TransactionController from "../controller/TransactionController";
import Authorization from "../auth/Authorization";

class TransactionRoutes extends BaseRoute {
  public routes() {
    this.router.post(
      "/deposit",
      Authorization.authJwt,
      TransactionController.deposit
    );

    this.router.post(
      "/withdrawal",
      Authorization.authJwt,
      TransactionController.withdrawal
    );

    this.router.post(
      "/transfer",
      Authorization.authJwt,
      TransactionController.transfer
    );

    this.router.get("/", Authorization.authJwt, TransactionController.show);
  }
}

export default new TransactionRoutes().router;
