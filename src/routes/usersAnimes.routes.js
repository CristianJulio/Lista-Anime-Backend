const { Router } = require("express");
const router = Router();
const { addAnime, removeAnime } = require("../controllers/usersAnimes.controller");
const { checkToken } = require("../middlewares/index");

// /api/users_animes
router.post("/", checkToken, addAnime);
router.delete("/:animeId", checkToken, removeAnime);

module.exports = router;