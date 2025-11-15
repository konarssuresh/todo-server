const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-router");
const todoRouter = require("./routes/todo-router");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { connectToDb } = require("./config/database");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      console.log({ origin, allowedOrigins });
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(todoRouter);

connectToDb().then(() => {
  console.log("db connection successful");
  app.listen(process.env.PORT, (err) => {
    if (!err) {
      console.log("Server listening at port" + process.env.PORT);
    }
  });
});
