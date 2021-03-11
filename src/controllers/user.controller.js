const User = require("../models/User");
const jwt = require("jsonwebtoken");
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

    // SIGN TOKEN
    jwt.sign({ userId: createdUser.id }, process.env.SECRET_WORD, { expiresIn: 86400 }, function(err, token) {
      if(err) throw err;
      
      // RESPONSE
      res.status(200).json({ msg: "user Created Successfully", token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.deleteUser = async function (req, res) {
  const reqUserId = req.userId;
  const paramsUserId = req.params.userId;

  try {
    const user = await User.findOne({ where: { id: reqUserId } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.id !== Number(paramsUserId))
      return res.status(401).json({msg: "This user does not have permissions to perform this action ",});

    await User.destroy({ where: { id: paramsUserId } });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};
