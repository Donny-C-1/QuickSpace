import passport from "passport";
import userModel from "../models/user_schema.js";
import asyncHandler from "express-async-handler";
import { encrypt } from "../utils/password.js";
import { body, matchedData, validationResult } from "express-validator";
import { fileURLToPath } from "url";
import path from "path";
import folderModel from "../models/folder_schema.js";
import { promises as fs } from "fs";
// import fileMO from "../models/file_schema.js";

/* -------------------
 * CREATE CONTROLLERS
 --------------------*/

//@desc Create a new user
//@route GET /auth/signup
//@access Public
const createUser = [
  body("email").trim(),
  body("password").trim(),
  body("confirm_password").trim(),
  function (req, res, next) {
    let result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    // Do some more validation
    res.redirect("/auth/signup");
  },
  asyncHandler(async function (req, res, next) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.join(path.dirname(__filename), "../");
    let data = matchedData(req);

    let { hash, salt } = await encrypt(data.password);

    let user = await userModel.create({
      email: data.email,
      role: "user",
      hash,
      salt
    });

    let folder = await folderModel.create({
      name: user.id,
      parent: null,
      sizeInBytes: 0,
      created: Date.now(),
      type: "folder",
      owner: user.id
    });

    user.storage = folder.id;
    await user.save();

    await fs.mkdir(path.join(__dirname, "uploads", folder.id));

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/drive");
    });
  })
];

/* ----------------
 * READ CONTROLLER
 -----------------*/

//@desc Check Authentication Status
//@route GET <Private Routes>
//@access Public
function checkAuth(req, res, next) {
  if (req.user) {
    res.locals.user = req.user;
    next();
  } else {
    res.redirect("/auth/login");
  }
}

//@desc Display Login Page
//@route GET /auth/login
//@access Public
function displayLogin(req, res) {
  res.locals.authType = "login";
  res.render("auth");
}

//@desc Display Signup Page
//@route GET /auth/signup
//@access Public
function displaySignup(req, res) {
  res.locals.authType = "signup";
  res.render("auth");
}

/* -------------------
 * UPDATE CONTROLLER
---------------------*/

//@desc Login a user
//@route POST /auth/login
//@access Public
const loginUser = [
  body("email"),
  body("password"),
  function (req, res, next) {
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.redirect("/auth/login");
    }

    passport.authenticate("local", function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        if (info.field === "email") {
          req.session.emailError = info.value;
        } else {
          req.session.passwordError = info.value;
        }
        return res.redirect("/auth/login");
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/drive");
      });
    })(req, res, next);
  }
];

/* -------------------
 * DELETE CONTROLLER
---------------------*/

//@desc Logout a user
//@route GET /auth/logout
//@access Public
function logoutUser(req, res) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

export {
  createUser,
  checkAuth,
  displayLogin,
  displaySignup,
  loginUser,
  logoutUser
};
