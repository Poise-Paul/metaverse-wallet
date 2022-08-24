import { Router } from "express";
const router = Router();

router.post("/", async (req, res) => {
    const { btcId, ethId, bchId, dogeId } = req.body;
    const getTransactions = () => {
  const resp = await fetch(
    `https://api-eu1.tatum.io/v3/ledger/transaction/account?pageSize=50&count="true"`,
    {
      id,
    }
  );
        return await resp.json()
    }

    const btcTransactions = getTransactions()
    // Pause Hete

});
