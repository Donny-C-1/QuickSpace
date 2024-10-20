import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../models/user_schema.js";
import { validatePassword } from "../utils/password.js";
// import GoogleStrategy from "passport-google-oauth20";

function passportConfig() {
  const options = { usernameField: "email" };

  const verify = (email, password, cb) => {
    userModel.findOne({ email: email }).then((userObj) => {
      if (!userObj) return cb(null, false, { message: "Email does not exist" });

      validatePassword(password, userObj.salt, userObj.hash).then((isValid) => {
        if (!isValid) return cb(null, false, { message: "Incorrect password" });
        return cb(null, userObj);
      });
    });
  };

  passport.use(new LocalStrategy(options, verify));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, {
        id: user.id,
        email: user.email,
        storage: user.storage
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
}

function passportGoogleConfig() {
  const options = {
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  };

  const verify = (_accessToken, _refreshToken, profile, cb) => {
    console.debug("Profile");
    googleUser
      .findOne({ googleID: profile.id })
      .then((returnedUser) => {
        if (returnedUser == null)
          return googleUser.create({
            googleID: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
          });

        cb(null, returnedUser);
      })
      .then((createdUser) => {
        if (createdUser == undefined) return;
        cb(null, createdUser);
      })
      .catch((err) => {
        cb(err, false);
        console.log(err);
      });
  };

  passport.use(new GoogleStrategy(options, verify));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user.username);
    });
  });

  passport.deserializeUser(function (username, cb) {
    process.nextTick(function () {
      cb(null, username);
    });
  });
}

export default passportConfig;
