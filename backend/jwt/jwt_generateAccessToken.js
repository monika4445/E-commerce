const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;

function generateAccessToken(email, role, id, is_verified) {
  return jwt.sign({ email, role, id , is_verified}, SECRET, { expiresIn: "36000s" });
}

module.exports = { generateAccessToken };
