const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

// Global
const errorMessage = "Internal server error";

// Use this function to create a new User
exports.createUser = async function (req, res) {
  const { username, email, password, terms_accepted } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    // Encrypt the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, salt);

    // Create a new User
    const createdUser = await User.create(
      {
        username,
        email,
        password: hashedPass,
        terms_accepted,
      },
      {
        fields: ["username", "email", "password", "terms_accepted"],
      }
    );

    // RESPONSE
    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};
