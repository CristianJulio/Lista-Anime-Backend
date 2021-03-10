const { Router } = require("express");
const router = Router();
const { addAnime } = require("../controllers/usersAnimes.controller");
const { checkToken } = require("../middlewares/index");

// /api/users_animes
router.post("/", checkToken, addAnime);

module.exports = router;