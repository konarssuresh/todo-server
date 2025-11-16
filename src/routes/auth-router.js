const express = require("express");
const jwt = require("jsonwebtoken");
const {
  validateSignupReq,
  validateLoginRequest,
} = require("../utils/validate");
const { User } = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupReq(req);
    const { emailId, password, firstName, lastName } = req.body;

    let user = new User({
      firstName,
      lastName,
      emailId,
    });

    await user.generateHash(password);

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginRequest(req);

    const { emailId, password } = req.body;

    let user = await User.findOne({ emailId });
    console.log(user);
    if (!user) {
      throw new Error("Username and password does not match");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("username and password does not match");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: isProd, // true in prod (HTTPS), false locally (HTTP)
      sameSite: isProd ? "none" : "lax", // cross-site cookies require none+secure
      path: "/",
    };

    if (isProd && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN; // e.g. ".example.com"
    }

    res.cookie("token", token, cookieOptions);
    res.send({ message: "login successful" });
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null);
  res.send({ message: "logout successful" });
});

module.exports = authRouter;
