import { Router } from "express";
import authRouter from "./authRouter.js";
import driveRouter from "./driveRouter.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Default Page");
});

router.use("/auth", authRouter);

router.use("/drive", driveRouter);

export default router;
