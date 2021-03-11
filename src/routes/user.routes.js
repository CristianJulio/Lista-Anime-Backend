const { Router } = require("express");
const router = Router();
const { createUser, deleteUser } = require("../controllers/user.controller");
const { checkNewUser, checkTerms, checkToken } = require("../middlewares/index");
const { check } = require("express-validator");

// /api/users
router.get("/");

router.post("/", [
  check("username", "Username is required").not().isEmpty(),
  check("email", "Enter a valid email").isEmail(),
  check("password", "Password must have a minimum of 6 characters").isLength({ min: 6 })
], checkTerms, checkNewUser, createUser);

router.put("/");

router.delete("/:userId", checkToken, deleteUser);

module.exports = router;