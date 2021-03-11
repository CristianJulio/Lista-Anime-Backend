const User = require("../models/User");
const Anime = require("../models/Anime");
const UsersAnimes = require("../models/UsersAnimes");
const { validationResult } = require("express-validator");

// GLOABL
const errorMessage = "Internal server error";

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
      return res.status(400).json({ msg: "Can not perform this action" });

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
  try {
    res.status(200).json({ msg: "Tengo que terminarlo" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.updateAnime = async function(req, res) {
  try {
    res.status(200).json("Tengo que terminarlo");
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}