const errorMessage = "Internal server error";
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.checkNewUser = async function(req, res, next) {
  const { username, email } = req.body;
  
  try {
    const userFound = await User.findOne({ where: { username } });
    console.log(userFound);
    if(userFound) return res.status(400).json({ msg: "Username already in use" });

    const emailFound = await User.findOne({ where: { email } });
    if(emailFound) return res.status(400).json({ msg: "Email already in use" });

    next()
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}

exports.checkTerms = function(req, res, next) {
  const { terms_accepted } = req.body;
  
  if(!terms_accepted) return res.status(400).json({ msg: "Terms must be accepted" });

  next();
}

exports.checkToken = async function(req, res, next) {
  const token = req.headers['x-auth-token'];

  if(!token) return res.status(404).json({ msg: 'No token provided' });
  
  jwt.verify(token, process.env.SECRET_WORD, function(err, decoded) {
    if(err) throw err;
    req.userId = decoded.userId;
    next();
  });
}