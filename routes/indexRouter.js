import { Router } from "express";
import authRouter from "./authRouter.js";
import driveRouter from "./driveRouter.js";
import { checkAuth } from "../controller/authController.js";

const router = Router();

router.get("/", (req, res) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  res.render("home");
});

router.use("/auth", authRouter);

router.use("/drive", checkAuth, driveRouter);

export default router;
