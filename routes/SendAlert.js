import { Router } from "express";
import { User } from "../model/userSchemas.js";
const router = Router();

router.post("/", async (req, res) => {
  const _id = req.body.id;
  if (_id) {
    try {
      const result = await User.updateOne(
        { _id },
        {
          $set: {
            sentAlert: true,
          },
        }
      );
      res.send("Alert status updates successfully");
    } catch (error) {
      res.send(error.message);
    }
  } else {
    res.send("Could not update message");
  }
});

export { router as sendAlert };
