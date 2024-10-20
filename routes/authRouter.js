import { Router } from "express";
import {
  createUser,
  displayLogin,
  displaySignup,
  loginUser,
  logoutUser
} from "../controller/authController.js";

const router = Router();

router.route("/signup").get(displaySignup).post(createUser);

router.route("/login").get(displayLogin).post(loginUser);

router.route("/logout").get(logoutUser);
export default router;
