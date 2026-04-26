const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authcontroller");
const { protect } = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

module.exports = router;
