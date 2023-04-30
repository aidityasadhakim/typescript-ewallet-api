import IController from "./ControllerInterface";
import { Request, Response } from "express";
import { startSession } from "mongoose";
import TransactionServices from "../services/TransactionServices";

class TransactionController implements IController {
  show = async (req: Request, res: Response) => {
    const TransactionService = new TransactionServices(req);
    const transaction = await TransactionService.show();

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  };

  deposit = async (req: Request, res: Response) => {
    const TransactionService = new TransactionServices(req);
    const user = await TransactionService.getUserById();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const amount: number = <number>req.body.amount;

    const session = await startSession();

    try {
      session.startTransaction();

      const depositTransaction =
        await TransactionService.depositTransactionById(user.id);

      if (!depositTransaction) {
        throw new Error("Deposit Failed");
      }

      try {
        const transaction = await TransactionService.transactionDetails(
          depositTransaction.id,
          amount,
          "deposit"
        );

        if (!transaction) {
          throw new Error("Deposit Failed on Saving Transaction");
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          success: true,
          data: transaction,
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      if (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: error.message });
      }

      return res.status(500).json({ message: "Something went wrong" });
    }
  };

  withdrawal = async (req: Request, res: Response) => {
    const TransactionService = new TransactionServices(req);

    const userId = TransactionService.userId;
    const user = await TransactionService.getUserById();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await startSession();

    try {
      session.startTransaction();
      const amount: number = <number>req.body.amount;

      if (amount > user.balance) {
        throw new Error("Insufficient Balance");
      }

      const withdrawalTransaction = await TransactionService.withdrawalById(
        user.id
      );

      if (!withdrawalTransaction) {
        throw new Error("Withdrawal Failed");
      }

      try {
        const transaction = await TransactionService.transactionDetails(
          withdrawalTransaction.id,
          amount,
          "withdrawal"
        );

        if (!transaction) {
          throw new Error("Withdrawal Failed on Saving Transaction");
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          success: true,
          data: transaction,
        });
      } catch (error) {}
    } catch (error: any) {
      if (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: error?.message });
      }

      await session.abortTransaction();
      session.endSession();

      return res
        .status(500)
        .json({ error: error, message: "Something went wrong" });
    }
  };

  transfer = async (req: Request, res: Response) => {
    const TransactionService = new TransactionServices(req);

    const destinationAccount: string = req.body.destinationAccount;

    const user = await TransactionService.getUserById();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const amount: number = <number>req.body.amount;

    if (amount > user.balance) {
      return res.status(404).json({ error: "Insufficient Balance" });
    }

    const session = await startSession();

    try {
      session.startTransaction();

      const transferTransaction = await TransactionService.withdrawalById(
        user.id
      );

      if (!transferTransaction) {
        throw new Error("Transfer Failed");
      }

      try {
        const depositDestination =
          await TransactionService.depositTransactionById(destinationAccount);

        if (!depositDestination) {
          throw new Error("Transfer Failed");
        }

        try {
          const transaction = await TransactionService.transactionDetails(
            user.id,
            amount,
            "transfer",
            destinationAccount
          );

          if (!transaction) {
            throw new Error("Transfer Failed on Saving Transaction");
          }

          await session.commitTransaction();
          session.endSession();

          return res.status(200).json({
            success: true,
            data: transaction,
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({ error: error.message });
    }
  };
}

export default new TransactionController();
