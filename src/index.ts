import express, { Application, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";

// routers
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import TransactionRoutes from "./routes/TransactionRoutes";

class App {
  public app: Application;
  private api: string | undefined;

  constructor() {
    this.app = express();
    this.api = process.env.API_URL;
    this.dbConnect();
    this.middleware();
    this.routes();
    this.listeners();
  }

  protected dbConnect(): void {
    const options: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "ewallet_database",
    };

    mongoose
      .connect(`${process.env.CONNECTION_STRING}`, options)
      .then(() => {
        console.log("Connected to database");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  protected middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan("tiny"));
  }

  protected routes(): void {
    this.app.use(`${this.api}/users`, UserRoutes);
    this.app.use(`${this.api}/`, AuthRoutes);
    this.app.use(`${this.api}/transaction`, TransactionRoutes);
  }

  protected listeners() {
    this.app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
}

const app = new App();
