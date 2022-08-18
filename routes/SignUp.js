import { Router } from "express";
import { User } from "../model/userSchemas.js";
import { Random } from "random-js";
import { config } from "dotenv";
import {
  generateWallet,
  Currency,
  generateDepositAddress,
} from "@tatumio/tatum";
// import axios from "axios";
// import fetch from "node-fetch";
import axios from "axios";

const random = new Random();
const router = Router();
config();
router.post("/", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  console.log(req.body);
  if ((firstName, lastName, email, password, username)) {
    try {
      const checkMail = await User.find({ $or: [{ email }, { username }] });
      console.log("Check Verification Status", checkMail);
      if (checkMail.length !== 0) {
        console.log("User Already Exists");
        res
          .status(400)
          .send("User Already Exist With Same Email | Username 🧐");
      } else {
        // Create Virtual Account Here
        console.log("Account is processing");
        const createWtalletVirtual = async (wallet, currency) => {
          const createVirtualAccount = async (cur, xpub) => {
            const resp = await fetch(
              `https://api-eu1.tatum.io/v3/ledger/account`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": `${process.env.TATUM_API_KEY}`,
                },
                body: JSON.stringify({
                  currency: cur,
                  xpub,
                }),
              }
            );
            return resp.json();
          };

          try {
            const v_account = await createVirtualAccount(currency, wallet.xpub);
            console.log("Virtual Account", v_account);
            // Create Virtual Address
            const v_address = await generateDepositAddress(v_account.id);
            console.log("Virtual-Address", v_address);
            return { wallet, v_account, v_address };
          } catch (error) {
            console.log(error.message);
          }
        };
        // End Virtual Account Here

        // Create Btc Wallet / Virtual Account
        const btcWallet = await generateWallet(Currency.BTC, false);
        console.log("Your Btc Wallet", btcWallet);
        const btcVirtual = await createWtalletVirtual(btcWallet, "BTC");
        console.log("btc", btcVirtual);
        // Create Eth Wallet and Address
        const ethWallet = await generateWallet(Currency.ETH, false);
        console.log("Your Eth Wallet", ethWallet);

        const ethVirtual = await createWtalletVirtual(ethWallet, "ETH");
        console.log("eth", ethVirtual);
        // Create Bch Wallet
        const bchWallet = await generateWallet(Currency.BCH, false);
        console.log("Your Bch Wallet", bchWallet);
        const bchVirtual = await createWtalletVirtual(bchWallet, "BCH");
        console.log("bch", bchVirtual);
        // Create Doge Wallet
        const dogeWallet = await generateWallet(Currency.DOGE, false);
        console.log("Your Doge Wallet", dogeWallet);
        const dogeVirtual = await createWtalletVirtual(dogeWallet, "DOGE");
        console.log("doge", dogeVirtual);
        // Add Wallet to Db
        if ((btcVirtual, ethVirtual, bchVirtual, dogeVirtual)) {
          ///Add to db
          const registerUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
            sentAlert: false,
            btcVirtual,
            ethVirtual,
            bchVirtual,
            dogeVirtual,
          });
          registerUser.save(); // Save user Details / Wallets & Virtual Accounts
          res.status(200).send("Account Created Successfully 🥳");
        } else {
          res.status(400).send("Something Went Wrong");
          console.log("Could not create all Wallets");
        }
      }
    } catch (error) {
      res.status(404).send(`${error.message}`);
    }
  } else {
    res.status(400).send("Something went wrong");
  }
});

export { router as signUp };
