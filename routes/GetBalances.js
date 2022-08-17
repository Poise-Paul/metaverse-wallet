import { getAccountBalance } from "@tatumio/tatum";
import { Router } from "express";
const router = new Router();

router.post("/", async (req, res) => {
  console.log("I was called", req.body);
  const balance1 = await getAccountBalance(req.body.btcId);
  const balance2 = await getAccountBalance(req.body.ethId);
  const balance3 = await getAccountBalance(req.body.bchId);
  const balance4 = await getAccountBalance(req.body.dogeId);
  const allBalances = { balance1, balance2, balance3, balance4 };
  console.log("All Balances", allBalances);
  res.status(200).send(allBalances);
});

export { router as getBalances };
