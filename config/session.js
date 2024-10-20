import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

/*
 * Session Middleware
 * It saves session data to a database and passes an ID as a cookie to the browser
 * Will work without the store but won't persist beyond a single process(will forget once the browser is closed)
 */

function sessionMiddleware() {
  const sessionStore = MongoStore.create({
    client: mongoose.connection.getClient(),
    dbName: process.env.DB_NAME // Optional
  });

  const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 20 } // 5 minutes
  });

  return sessionConfig;
}

export default sessionMiddleware;
