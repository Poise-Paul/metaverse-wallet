import { Router } from "express";
import { User } from "../model/userSchemas.js";
import { Random } from "random-js";
import { config } from "dotenv";
import {
  generateWallet,
  Currency,
  generateDepositAddress,
  generatePrivateKeyFromMnemonic,
} from "@tatumio/tatum";
import axios from "axios";

const random = new Random();
const router = Router();
config();
router.post("/", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  if ((firstName, lastName, email, password, username)) {
    try {
      const checkMail = await User.find({ $or: [{ email }, { username }] });
      if (checkMail.length !== 0) {
        res
          .status(400)
          .send("User Already Exist With Same Email | Username 🧐");
      } else {
        // Create Virtual Account Here
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
            // Create Virtual Address
            const v_address = await generateDepositAddress(v_account.id);
            const privateKey = await generatePrivateKeyFromMnemonic(
              wallet.mnemonic
            );
            return { wallet, v_account, v_address, privateKey };
          } catch (error) {}
        };
        // End Virtual Account Here
        // Create Btc Wallet / Virtual Account
        const btcWallet = await generateWallet(Currency.BTC, false);
        const btcVirtual = await createWtalletVirtual(btcWallet, "BTC");
        // Create Eth Wallet and Address
        const ethWallet = await generateWallet(Currency.ETH, false);
        const ethVirtual = await createWtalletVirtual(ethWallet, "ETH");
        // Create Bch Wallet
        const bchWallet = await generateWallet(Currency.BCH, false);
        const bchVirtual = await createWtalletVirtual(bchWallet, "BCH");
        // Create Doge Wallet
        const dogeWallet = await generateWallet(Currency.DOGE, false);
        const dogeVirtual = await createWtalletVirtual(dogeWallet, "DOGE");
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
