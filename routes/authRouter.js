import { Router } from "express";
import {
  displaySignupPage,
  displayLoginPage,
  handleSignupLogin
} from "../controller/authController.js";

const router = Router();

router.route("/signup").get(displaySignupPage).post(handleSignupLogin);

router.route("/login").get(displayLoginPage);
export default router;
