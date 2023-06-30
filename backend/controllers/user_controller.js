const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../jwt/jwt_generateAccessToken");
const { sendEmail } = require("../mailers/email_confirmation");
const { validationResult, body } = require("express-validator");
require("dotenv").config();

const { User } = require("../models");

const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

const registerValidationRules = [
  body("userName")
    .isLength({ min: 6 })
    .withMessage("UserName must be at least 6 characters")
    .notEmpty()
    .withMessage("UserName can not be empty"),
  body("email").isEmail().withMessage("Bad email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

async function register(req, res) {
  const { userName, email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ error: errorMessage });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "A User account with this email already exists" });
    }

    const newUser = {
      userName,
      email,
      password: hashed_password,
    };
    User.create(newUser)
      .then((user) => {
        const token = generateAccessToken(email, 0, user.id, user.is_verified);
        sendEmail(email, `http://localhost:${PORT}/verify?token=${token}`);
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({ message: "" });
      });
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}

const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });x
    if (!user) {
      return res.status(400).json("Email is not correct");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = generateAccessToken(
        email,
        user.role,
        user.id,
        user.is_verified
      );
      res.send(
        JSON.stringify({
          status: "Logged in",
          jwt: token,
          role: user.role,
          userName: user.userName,
          is_verified: user.is_verified,
        })
      );
    } else if (user.is_verified === 0) {
      return res.status(400).json("You Need Verification!");
    } else {
      return res.status(400).json("Invalid password");
    }
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}

async function confirm_email(req, res) {
  try {
    const token = req.query.token;
    console.log(token, "token");
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded:", decoded);
    await User.update({ is_verified: 1 }, { where: { email: decoded.email } });
    res.status(200).json({ message: "Verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function allUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  confirm_email,
  allUsers,
  registerValidationRules,
  loginValidationRules,
};
