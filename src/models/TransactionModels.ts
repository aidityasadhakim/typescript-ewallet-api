import { Date, Schema, Types, model } from "mongoose";

export default interface Transaction {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: string;
  amount: number;
  destinationAccount?: Types.ObjectId;
  transactionDate: Date;
}

const schema = new Schema<Transaction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: Schema.Types.String,
    required: true,
    enum: ["withdrawal", "deposit", "transfer"],
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  destinationAccount: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

export const TransactionModel = model<Transaction>(
  "Transaction",
  schema,
  "transactions"
);
