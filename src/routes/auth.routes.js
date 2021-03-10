const { Router } = require("express");
const router = Router();
const { signin, getCurrentUser } = require("../controllers/auth.controller");
const { checkToken } = require("../middlewares/index");

// /api/auth
router.get("/", checkToken, getCurrentUser);
router.post("/", signin);

module.exports = router;