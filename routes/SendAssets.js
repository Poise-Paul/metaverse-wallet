import { sendBitcoinTransaction } from "@tatumio/tatum";
import axios from "axios";
import { Router } from "express";
const router = Router();
import fetch from "node-fetch";
router.post("/", async (req, res) => {
  console.log(req.body);
  // Check for the erroer and send to client
  const checkError = (result) => {
    if (result.statusCode >= 400) {
      res.status(400).send(result.message);
    } else if (result.statusCode === 200) {
      res.status(200).send(result.txId);
    }
  };
  if (
    req.body.currency === "btc" ||
    req.body.currency === "bch" ||
    req.body.currency === "doge"
  ) {
    console.log("Inside --", req.body, req.body.currency);
    try {
      const resp = await fetch(
        `https://api-eu1.tatum.io/v3/offchain/bitcoin/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.TATUM_API_KEY}`,
          },
          body: JSON.stringify({
            senderAccountId: `${req.body.senderAccountId}`,
            address: `${req.body.address}`,
            amount: `${req.body.amount}`,
            mnemonic: `${req.body.mnemonic}`,
            xpub: `${req.body.xpub}`,
            fee: `${req.body.fee}`,
          }),
        }
      );
      const result = await resp.json();
      console.log(result);
      checkError(result);
    } catch (error) {
      res.status(400).send(error.message);
      console.log(error.message);
    }
  } else if (req.body.currency === "eth") {
   console.log("Inside --", req.body, req.body.currency);
    try {
      const resp = await fetch(
        `https://api-eu1.tatum.io/v3/offchain/ethereum/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.TATUM_API_KEY}`,
          },
          body: JSON.stringify({
            address: `${req.body.address}`,
            amount: `${req.body.amount}`,
            privateKey: `${req.body.privateKey}`,
            senderAccountId: `${req.body.senderAccountId}`,
          }),
        }
      );
      const result = await resp.json();
      console.log(result);
      checkError(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
});

export { router as sendAssets };
