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
// import fetch from "node-fetch";
const random = new Random();
const router = Router();
config();
router.post("/", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  console.log("Here's Request Body --", req.body);
  if ((firstName, lastName, email, password, username)) {
    try {
      const checkMail = await User.find({ $or: [{ email }, { username }] });
      if (checkMail.length !== 0) {
        res
          .status(400)
          .send("User Already Exist With Same Email | Username 🧐");
      } else {
        // Create Virtual Account Here
        const vitualCurrency = async (wallet, currency) => {
          let curParam;
          switch (currency) {
            case "BTC":
              curParam = `bitcoin`;
              break;
            case "ETH":
              curParam = `ethereum`;
            case "BCH":
              curParam = `bcash`;
            case "DOGE":
              curParam = `dogecoin`;
            default:
              break;
          }
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

          console.log("Curr ---", currency, wallet.xpub);
          const v_account = await createVirtualAccount(currency, wallet.xpub);
          // Create Virtual Address
          const v_address = await generateDepositAddress(v_account.id);

          const resp = await fetch(
            `https://api-eu1.tatum.io/v3/${curParam}/wallet/priv`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.TATUM_API_KEY}`,
              },
              body: JSON.stringify({
                index: 0,
                mnemonic: wallet.mnemonic,
              }),
            }
          );
          const privateKey = await resp.json();
          return { wallet, v_account, v_address, privateKey };
        };
        // End Virtual Account Here
        // Create Btc Wallet / Virtual Account
        const btcWallet = await generateWallet(Currency.BTC, false);
        const btcVirtual = await vitualCurrency(btcWallet, "BTC");
        const ethWallet = await generateWallet(Currency.ETH, false);
        const ethVirtual = await vitualCurrency(ethWallet, "ETH");
        const bchWallet = await generateWallet(Currency.BCH, false);
        const bchVirtual = await vitualCurrency(bchWallet, "BCH");
        const dogeWallet = await generateWallet(Currency.DOGE, false);
        const dogeVirtual = await vitualCurrency(dogeWallet, "DOGE");
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
          res.status(400).send("Could not create your wallet");
        }
      }
    } catch (error) {
         console.log(error.message);
      res
        .status(404)
        .send(`Could not create your wallet 😖, Please try again later`);
   
    }
  } else {
    res.status(400).send("Something went wrong");
  }
});

export { router as signUp };
