import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashPassword,
      isMfaActive: false,
    });

    console.log(newUser);
    await newUser.save();

    res.status(201).json({ message: "User registraion is successfull" });
  } catch (e) {
    res.status(500).json("Something went wrong with registration...!");
  }
};
export const login = (req, res) => {
  console.log("Authenticated use is : ", req.user.username);

  res.status(201).json({
    message: "User login is successfull",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};
export const authStatus = (req, res) => {
  if (req.user) {
    res.status(201).json({
      message: "User MFA status fetched successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(201).json({ message: "Unauthorized User" });
  }
};
export const logout = (req, res) => {
  if (!req.user) return res.status(403).json({ message: "Unauthorize User" });

  req.logout((err) => {
    if (err) return res.status(401).json({ message: "Unauthorize User" });

    res.status(201).json({ message: "User logout successfully..." });
  });
};
export const setup2fa = async (req, res) => {
  try {
    const user = req.user;

    const secrete = speakeasy.generateSecret();

    user.twoFactorSecret = secrete.base32;
    user.isMfaActive = true;
    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secrete.base32,
      label: `${req.user.username}`,
      encoding: "base32",
    });

    console.log("url", url);

    const qrCodeImage = await qrcode.toDataURL(url);

    res.status(200).json({ secrete: secrete.base32, qrcode: qrCodeImage });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong while 2FA setup" });
  }
};
export const verify2fa = async (req, res) => {
  try {
    const user = req.user;
    const token = req.body.token;

    const verfied = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      token,
      encoding: "base32",
    });

    if (verfied) {
      const jwtToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "2fa is successfull", jwtToken });
    } else {
      res.status(500).json({ message: "Invalid 2FA token" });
    }
  } catch (e) {
    res.status(500).json({ message: "Something went wrong while 2FA verify" });
  }
};
export const reset2fa = async (req, res) => {
  try {
    const user = req.user;

    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();

    res.status(200).json({ message: "2fa reset for user" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong while 2FA reset" });
  }
};
