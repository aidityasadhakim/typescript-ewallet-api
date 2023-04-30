import { Request } from "express";
import jwtDecode from "jwt-decode";
import User, { UserModel } from "../models/UserModels";
import Transaction, { TransactionModel } from "../models/TransactionModels";

class TransactionService {
  userId: string;
  headers: Request["headers"];
  body: Request["body"];
  params: Request["params"];
  destinationAccount?: string;

  constructor(req: Request) {
    this.headers = req.headers;
    this.body = req.body;
    this.params = req.params;
    this.destinationAccount = req.body.destinationAccount;
    this.userId = this.getIdFromToken();
  }

  getIdFromToken = () => {
    const token: any = jwtDecode(<string>this.headers.authorization);
    return token.id;
  };

  getUserById = async () => {
    const user = await UserModel.findById(this.userId);
    return user;
  };

  depositTransactionById = async (destinationId: string) => {
    const depositTransaction = await UserModel.findByIdAndUpdate(
      destinationId,
      {
        $inc: { balance: this.body.amount },
      }
    );

    return depositTransaction;
  };

  transactionDetails = async (
    user: string,
    amount: number,
    type: string,
    destinationAccount?: string
  ) => {
    const transactionDetails = {
      user: user,
      amount: amount,
      type: type,
      destinationAccount: destinationAccount,
    };

    const transaction = await TransactionModel.create(transactionDetails);

    return transaction;
  };

  withdrawalById = async (destinationId: string) => {
    const withdrawal = await UserModel.findByIdAndUpdate(destinationId, {
      $inc: { balance: -this.body.amount },
    });

    return withdrawal;
  };

  show = async () => {
    const transaction = await TransactionModel.find();

    return transaction;
  };
}

export default TransactionService;
