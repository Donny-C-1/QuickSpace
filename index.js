import express from "express";
import { configDotenv } from "dotenv";
import router from "./routes/indexRouter.js";

const app = express();

// * Configure Options
app.set("view engine", "pug");
configDotenv();

// * Use Middleware
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
