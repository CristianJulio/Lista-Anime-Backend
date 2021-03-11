const Anime = require("../models/Anime");
const UsersAnimes = require("../models/UsersAnimes");

// GLOABL
const errorMessage = "Internal server error";

exports.addAnime = async function (req, res) {
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

  try {
    let anime;

    anime = await Anime.findOne({ where: { mal_id } });

    // Si el anime no existe en la base de datos lo agrega
    if (!anime) {
      anime = await Anime.create(
        {
          mal_id,
          title,
          episodes,
          image_url,
          type,
        },
        {
          fields: ["mal_id", "title", "episodes", "image_url", "type"],
        }
      );
    }

    // Agrego el anime a la lista del usuario
    await UsersAnimes.create({
      animeId: anime.id,
      userId: req.userId,
      status: status === "" ? "not_added" : status,
      score: score,
      progress: progress
    }, {
      fields: ['animeId', 'userId', 'status', 'score', 'progress']
    });

    res.status(200).json({ msg: "Anime Added" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
};

exports.removeAnime = async function(req, res) {
  try {
    res.status(200).json({ msg: "Anime Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: errorMessage });
  }
}
