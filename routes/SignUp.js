import { Router } from "express";
import { User } from "../model/userSchemas.js";
import { Random } from "random-js";
import { config } from "dotenv";
import {
  generateWallet,
  Currency,
  generateDepositAddress,
  CreateAccount,
  createAccount,
} from "@tatumio/tatum";
// import axios from "axios";
// import fetch from "node-fetch";

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
        const createVirtual_Account = async (currency, xpub, exId) => {
          const virtual_account = await fetch(
            "https://api-eu1.tatum.io/v3/ledger/account",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.TATUM_API_KEY}`,
              },
              body: JSON.stringify({
                currency: `${currency}`,
                xpub: `${xpub}`,
                customer: {
                  accountingCurrency: "USD",
                  customerCountry: "US",
                  externalId: `${exId}`,
                  providerCountry: "US",
                },
                compliant: false,
                accountCode: "AC_1011_B",
                accountingCurrency: "USD",
                accountNumber: `${exId}`,
              }),
            }
          );
          return virtual_account;
        };
        // End Virtual Account Here

        // Create Virtual Address
        const createVirtualAddress = async (v_account) => {
          const id = v_account.id;
          const virtual_address = await generateDepositAddress(id);
          console.log("btc_v_address", virtual_address);
          return virtual_address;
        };
        // End Virtual Address Creation

        // Create Btc Wallet / Virtual Account
        const btcWallet = await generateWallet(Currency.BTC, false);
        console.log("Your Btc Wallet", btcWallet);
        const createBtcVirtual = async () => {
          try {
            const exId = random.integer(1, 10000);
            // Create Virtual Account
            const virtual_Account = await createVirtual_Account(
              "BTC",
              btcWallet.xpub,
              exId
            );
            const v_account = await virtual_Account.json();
            console.log("Virtual Account", v_account);
            // Create Virtual Address
            const btc_v_address = await createVirtualAddress(v_account);
            return { btcWallet, v_account, btc_v_address };
          } catch (error) {
            console.log(error.message);
          }
        };
        const btcVirtual = await createBtcVirtual();
        console.log("btc", btcVirtual);
        // Create Eth Wallet and Address
        const ethWallet = await generateWallet(Currency.ETH, false);
        console.log("Your Eth Wallet", ethWallet);
        const createEthVirtual = async () => {
          try {
            const exId = random.integer(1, 10000);
            const virtual_Account = await createVirtual_Account(
              "ETH",
              ethWallet.xpub,
              exId
            );
            const v_account = await virtual_Account.json();
            console.log("Virtual Account", v_account);
            // Create Virtual Address
            const eth_v_address = await createVirtualAddress(v_account);
            return { ethWallet, v_account, eth_v_address };
          } catch (error) {
            console.log(error.message);
          }
        };
        const ethVirtual = await createEthVirtual();
        console.log("eth", ethVirtual);
        // Create Bch Wallet
        const bchWallet = await generateWallet(Currency.BCH, false);
        console.log("Your Bch Wallet", bchWallet);
        const createBchVirtual = async () => {
          try {
            const exId = random.integer(1, 10000);
            const virtual_Account = await createVirtual_Account(
              "BCH",
              bchWallet.xpub,
              exId
            );
            const v_account = await virtual_Account.json();
            console.log("Virtual Account", v_account);
            // Create Virtual Address
            const bch_v_address = await createVirtualAddress(v_account);
            return { bchWallet, v_account, bch_v_address };
          } catch (error) {
            console.log(error.message);
          }
        };
        const bchVirtual = await createBchVirtual();
        console.log("bch", bchVirtual);
        // Create Doge Wallet
        const dogeWallet = await generateWallet(Currency.DOGE, false);
        console.log("Your Doge Wallet", dogeWallet);
        const createDogeVirtual = async () => {
          try {
            const exId = random.integer(1, 10000);
            const virtual_Account = await createVirtual_Account(
              "DOGE",
              dogeWallet.xpub,
              exId
            );
            const v_account = await virtual_Account.json();
            console.log("Virtual Account", v_account);
            // Create Virtual Address
            const doge_v_wallet = await createVirtualAddress(v_account);
            return { dogeWallet, v_account, doge_v_wallet };
          } catch (error) {
            console.log(error.message);
          }
        };
        const dogeVirtual = await createDogeVirtual();
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
