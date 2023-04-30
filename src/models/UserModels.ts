import { model, Schema, Types } from "mongoose";

export default interface User {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  balance: number;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      maxlength: 200,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    balance: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export const UserModel = model<User>("User", schema, "users");
