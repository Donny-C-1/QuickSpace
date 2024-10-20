// Load environment variables
import "dotenv/config";

// Import the rest
import express from "express";
import router from "./routes/indexRouter.js";
import database from "./config/database.js";
import passport from "passport";
import sessionConfig from "./config/session.js";
import passportConfig from "./config/passport.js";

const app = express();

// * Configure Options
app.set("view engine", "pug");
app.set("views", "views");
database();
passportConfig();

// * Use Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(sessionConfig());
app.use(passport.authenticate("session"));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
