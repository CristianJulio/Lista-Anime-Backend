const User = require("../models/User");
const jwt = require("jsonwebtoken");

const errorMessage = "Internal server error";

exports.checkNewUser = async function(req, res, next) {
  const { username, email } = req.body;
  
  try {
    if(username || email) {
      const userFound = await User.findOne({ where: { username } });
      if(userFound) return res.status(400).json({ msg: "Username already in use" });

      const emailFound = await User.findOne({ where: { email } });
      if(emailFound) return res.status(400).json({ msg: "Email already in use" });
    } else {
      next();
    }

    
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

  if(!token) return res.status(400).json({ msg: 'No token provided' });
  
  try {
    jwt.verify(token, process.env.SECRET_WORD, function(err, decoded) {
      if(err) throw err;
      req.userId = decoded.userId;
      next();
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}