import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./configs/dbConnect.js";
import authRoute from "./routes/authRoute.js";
import "./configs/passportConfig.js";

dotenv.config();
dbConnect();

const app = express();

//Middlwares

const corsOptions = {
  origin: ["http:localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: "true" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", authRoute);

//Listen app

const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log("listening on port " + `${PORT}`);
});
