const User = require("../models/User");
const Anime = require("../models/Anime");
const UsersAnimes = require("../models/UsersAnimes");
const { validationResult } = require("express-validator");

// GLOABL
const errorMessage = "Internal server error";

exports.getAnimeFromList = async function(req, res) {
  const mal_id = req.params.mal_id;
  const reqUserId = req.userId;

  try {
    const anime = await Anime.findOne({ where: { mal_id } });
    if(!anime) return res.status(200).json({ isAdded: false });

    const isAdded = await UsersAnimes.findOne({ where: { userId: reqUserId, animeId: anime.id } });
    if(!isAdded) return res.status(200).json({ isAdded: false });

    res.status(200).json({ anime: { ...anime.dataValues, ...isAdded.dataValues }, isAdded: true });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}

exports.addAnime = async function (req, res) {
  // Manejo los errores al enviar los datos
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // Extraigo los datos del cuerpo de la petición
  const {
    mal_id,
    title,
    episodes,
    image_url,
    type,
    status,
    score,
    progress,
  } = req.body;

  const reqUserId = req.userId;

  try {
    // Verifico que el usuario que está haciendo la petición exista
    const user = await User.findOne({ where: { id: reqUserId } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    let anime;

    // Busco el anime que se quiere agregar a la lista en la base de datos
    anime = await Anime.findOne({ where: { mal_id } });

    // Si el anime no existe en la base de datos lo agrego
    if (!anime) {
      anime = await Anime.create(
        {
          mal_id,
          title,
          episodes: episodes === "" ? null : episodes, // Si los episodios son un string vacío lo guardo com null
          image_url,
          type,
        },
        { fields: ["mal_id", "title", "episodes", "image_url", "type"] }
      );
    }

    // Busco si el usuario ya tiene agregado el anime
    const pairdFound = await UsersAnimes.findOne({
      where: {
        animeId: anime.id,
        userId: reqUserId,
      },
    });

    // Si el usuario ya tiene el anime agregado no puede agregarlo de nuevo
    if (pairdFound)
      return res
        .status(400)
        .json({ msg: "This anime already exists in your list" });

    // Agrego el anime a la lista del usuario
    await UsersAnimes.create(
      { animeId: anime.id, userId: reqUserId, status, score, progress },
      { fields: ["animeId", "userId", "status", "score", "progress"] }
    );

    res.status(200).json({ msg: "Anime Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.removeAnime = async function (req, res) {
  const reqUserId = req.userId;
  const paramsAnimeId = req.params.animeId;

  try {
    // Verifico que el usuario que está haciendo la petición exita
    const user = await User.findOne({ where: { id: reqUserId } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verifico que el anime este agregado en la lista del usuario
    const pairdFound = await UsersAnimes.findOne({
      where: {
        animeId: paramsAnimeId,
        userId: reqUserId,
      },
    });
    if (!pairdFound)
      return res
        .status(404)
        .json({ msg: "This anime does not exist in user list" });

    // Remuevo el anime de la lista del usuario
    await UsersAnimes.destroy({
      where: {
        animeId: paramsAnimeId,
        userId: reqUserId,
      },
    });

    res.status(200).json({ msg: "Anime deleted from user list" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.updateAnime = async function (req, res) {
  const { status, score, progress } = req.body;
  const reqUserId = req.userId;
  const paramsAnimeId = req.params.animeId;

  try {
    // Verifico si el usuario que está haciendo la petición existe
    const user = await User.findOne({ where: { id: reqUserId } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verifico que el anime este agregado en la lista del usuario
    const pairdFound = await UsersAnimes.findOne({
      where: {
        animeId: paramsAnimeId,
        userId: reqUserId,
      },
    });
    if (!pairdFound)
      return res
        .status(404)
        .json({ msg: "This anime does not exist in user list" });

    // Actualizo el estado del anime en la lista del usuario
    await UsersAnimes.update(
      {
        status: status ? status : pairdFound.status,
        score: score ? score : pairdFound.score,
        progress: progress ? progress : pairdFound.progress,
      },
      { where: { animeId: paramsAnimeId, userId: reqUserId } }
    );

    return res.status(200).json({ msg: `Anime entry Updated` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};