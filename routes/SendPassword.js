import { Router } from "express";
import generator from "generate-password";
const router = Router();

router.get("/", (req, res) => {
  const password = generator.generate({
    length: 12,
    strict: true,
  });
  res.send(password);
});

export {router as sendPassword};
