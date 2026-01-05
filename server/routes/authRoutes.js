const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authControllers");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  login
);

module.exports = router;