import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { sendAlert } from "./routes/SendAlert.js";
import { signIn } from "./routes/SignIn.js";
import { signUp } from "./routes/SignUp.js";
import { sendPassword } from "./routes/SendPassword.js";
import { getBalances } from "./routes/GetBalances.js";
import { Currency, generateWallet } from "@tatumio/tatum";
import { sendAssets } from "./routes/SendAssets.js";
import { transactions } from "./routes/GetTransactions.js";
import { forgotPassword } from "./routes/ForgetPassword.js";

const port = process.env.PORT || 8080;
const app = express();
dotenv.config();

process.env.TATUM_API_KEY;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Set Connection
const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}`);
    console.log("Database is connected :)");
  } catch (error) {
    console.log(error, "Something went wrong");
  }
};
connectDb();
// Bitcoin Wallet (Change testnest boolean to true when you deploy to mainnet)
app.use("/getPassword", sendPassword);
app.use("/signUp", signUp);
app.use("/signIn", signIn);
app.use("/sentAlert", sendAlert);
app.use("/getBalances", getBalances);
app.use("/sendAssets", sendAssets);
app.use("/transactions", transactions);
app.use("/forgotPassword", forgotPassword);
app.get("/", (req, res) => {
  res.send("Helo User");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
