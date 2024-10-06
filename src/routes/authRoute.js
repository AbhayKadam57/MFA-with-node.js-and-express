import { Router } from "express";
import {
  register,
  login,
  authStatus,
  logout,
  setup2fa,
  verify2fa,
  reset2fa,
} from "../controllers/authControllers.js";
import passport from "passport";

const router = Router();

//Register User
router.post("/register", register);

//Login user
router.post("/login", passport.authenticate("local"), login);

//Auth Status
router.get("/status", authStatus);

//logout
router.post("/logout", logout);

//mfa setup
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (!req.isAuthenticated())
      return res.status(403).json({ message: "Unauthorized User" });
    next();
  },
  setup2fa
);

//mfa verify
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (!req.isAuthenticated())
      return res.status(403).json({ message: "Unauthorized User" });
    next();
  },
  verify2fa
);

//mfa reset
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (!req.isAuthenticated())
      return res.status(403).json({ message: "Unauthorized User" });
    next();
  },
  reset2fa
);

export default router;
