// Load environment variables
import "dotenv/config";

// Import the rest
import express from "express";
import router from "./routes/indexRouter.js";
import database from "./config/database.js";

const app = express();

// * Configure Options
app.set("view engine", "pug");

// * Use Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  database();
});
