import { Router } from "express";
import { config } from "dotenv";
import { User } from "../model/userSchemas.js";
import jwt from "jsonwebtoken";

// All Google credentials
const router = new Router();
let secret;
// Send Mail
router
  .route("/")
  .post(async (req, res) => {
    try {
      const findUser = await User.findOne({
        email: req.body.mail,
      });
      if (findUser) {
        console.log("Valid mail");
        secret = `${process.env.JWT_SECRET}${findUser.password}`;
        const payload = {
          email: req.body.mail,
          id: findUser._id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });
        // Send Reset Link to mail
        // console.log(token, findUser);
        res.status(200).send({ _id: findUser._id, token });
      } else {
        res.send("Invalid email");
        console.log(findUser);
      }
    } catch (error) {
      console.log(error.message);
    }
  })
  .put(async (req, res) => {
    const { _id, token, password } = req.body;
    try {
      const isValid = jwt.verify(token, secret);
      const findUser = await User.findOne({ _id });
      console.log(isValid, findUser);
      const updateUser = await User.updateOne(
        { _id },
        { password },
        { runValidators: true }
      );
      console.log(updateUser);
      res.send("Pasword Updated");
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Something went wrong");
    }
  });

export { router as forgotPassword };
