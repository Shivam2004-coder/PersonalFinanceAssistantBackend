const express = require("express");
const { geminiSearch } = require("../controllers/geminiController");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/gemini/search", userAuth , geminiSearch);

module.exports = router;
