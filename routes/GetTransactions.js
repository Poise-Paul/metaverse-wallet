import { Router } from "express";
const router = Router();
import fetch from "node-fetch";
router.post("/", async (req, res) => {
  try {
    const { btcId, ethId, bchId, dogeId } = req.body;
    if ((btcId, ethId, bchId, dogeId)) {
      const getTransactions = async (id) => {
        const resp = await fetch(
          `https://api-eu1.tatum.io/v3/ledger/transaction/account?pageSize=50&count="true"`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": `${process.env.TATUM_API_KEY}`,
            },
            body: JSON.stringify({
              id,
            }),
          }
        );
        return await resp.json();
      };

      const btcTransactions = await getTransactions(btcId);
      const ethTransactions = await getTransactions(ethId);
      const bchTransactions = await getTransactions(bchId);
      const dogeTransactions = await getTransactions(dogeId);
      res.status(200).send({
        btcTransactions,
        ethTransactions,
        bchTransactions,
        dogeTransactions,
      });
    } else {
      console.log("Id's not recieved");
    }
  } catch (error) {
    res.status(400).send("Could not get transactions");
    console.log("Error", error.message);
  }
});

export { router as transactions };
