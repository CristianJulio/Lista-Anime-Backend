const { Router } = require("express");
const router = Router();
const { getAnimeFromList, addAnime, removeAnime, updateAnime } = require("../controllers/usersAnimes.controller");
const { checkToken } = require("../middlewares/index");
const { check } = require("express-validator");

// /api/users_animes
router.get("/:mal_id", checkToken, getAnimeFromList);

router.post("/", checkToken, [
  check("mal_id", "mal_id is required").not().isEmpty(),
  check("title", "Title is require").not().isEmpty(),
  check("image_url", "image_url is required").not().isEmpty(),
  check("type", "Type is required").not().isEmpty(),
  check("status", "Status is required").not().isEmpty(),
  check("score", "Score is required").not().isEmpty(),
  check("progress", "Progress is required").not().isEmpty()
], addAnime);

router.delete("/:animeId", checkToken, removeAnime);

router.put("/:animeId", checkToken, updateAnime);

module.exports = router;