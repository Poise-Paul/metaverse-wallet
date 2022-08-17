import { Router } from "express";
import { User } from "../model/userSchemas.js";
const router = Router();
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const result = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(300).send("Incorrect Credentials 😢");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

export { router as signIn };
