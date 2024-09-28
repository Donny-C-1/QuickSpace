import express from "express";
import { configDotenv } from "dotenv";
import router from "./routes/indexRouter.js";
import connectDB from "./config/database.js";

const app = express();

// * Configure Options
app.set("view engine", "pug");
configDotenv();
connectDB();

// * Use Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
