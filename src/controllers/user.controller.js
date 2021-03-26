const User = require("../models/User");
const UsersAnimes = require("../models/UsersAnimes");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const Anime = require("../models/Anime");

// Global
const errorMessage = "Internal server error";

// Use this function to create a new User
exports.createUser = async function (req, res) {
  const { username, email, password, terms_accepted, img_url } = req.body;
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
        img_url: img_url === "" ? null : img_url
      },
      {
        fields: ["username", "email", "password", "terms_accepted", "img_url"],
      }
    );

    // SIGN TOKEN
    jwt.sign({ userId: createdUser.id }, process.env.SECRET_WORD, { expiresIn: 86400 }, function(err, token) {
      if(err) throw err;
      
      // RESPONSE
      res.status(200).json({ msg: "User created successfully", token });
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
      return res.status(401).json({msg: "You do not have permissions to perform this action ",});

    await User.destroy({ where: { id: paramsUserId } });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.updateUser = async function(req, res) {
  try {
    res.status(200).json("Tengo que terminarlo");
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}

exports.getUser = async function(req, res) {
  const username = req.params.username;

  try {
    const user = await User.findOne(
      { where: { username } },
      { fields: ["id", "username", "email"] }
    );
    if (!user) return res.status(404).json("User not found");

    const animeList = await UsersAnimes.findAll({
      attributes: ["animeId", "status", "score", "progress"],
      where: { userId: user.id },
    });

    let animes = [];

    for (let i = 0; i < animeList.length; i++) {
      let anime = await Anime.findOne({
        attributes: ["title", "episodes", "type", "image_url", "mal_id"],
        where: { id: animeList[i].dataValues.animeId },
      });
      animes.push({ ...anime.dataValues, ...animeList[i].dataValues });
    }

    const completedAnimes = animes.filter(
      (anime) => anime.status === "completed"
    );
    const watchingAnimes = animes.filter(
      (anime) => anime.status === "watching"
    );
    const planningAnimes = animes.filter(
      (anime) => anime.status === "plan_to_watch"
    );
    const pausedAnimes = animes.filter((anime) => anime.status === "paused");
    const droppedAnimes = animes.filter((anime) => anime.status === "dropped");
    const rewatchingAnimes = animes.filter(
      (anime) => anime.status === "rewatching"
    );

    res.status(200).json({
      userInfo: { username: user.username },
      animeList: {
        completed: completedAnimes,
        watching: watchingAnimes,
        plan_to_watch: planningAnimes,
        paused: pausedAnimes,
        dropped: droppedAnimes,
        rewatching: rewatchingAnimes,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}