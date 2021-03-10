const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// GLOBAL
const errorMessage = "Internal server error";

exports.signin = async function(req, res) {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });
    if(!user) return res.status(404).json({ msg: `Username (${username}) does not exist` });

    console.log(user);
    
    const result = await bcryptjs.compare(password, user.password);

    if(!result) return res.status(400).json({ msg: "Incorrect Password" });

    jwt.sign({ userId: user.id }, process.env.SECRET_WORD, { expiresIn: 86400 }, function(err, token) {
      if(err) throw err;
      res.status(200).json({ msg: "You have successfully signed", token });
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}

exports.getCurrentUser = async function(req, res) {
  try {
    const user = await User.findOne({ where: { id: req.userId }, attributes: ['username'] });

    if(!user) return res.status(404).json({ msg: "User not found", user: {} });

    res.status(200).json({ user });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}