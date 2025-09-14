const express = require("express");
const multer = require("multer");
const { geminiSearch } = require("../controllers/geminiController");
const { userAuth } = require("../middlewares/auth");

const upload = multer(); // memory storage
const router = express.Router();

router.post("/gemini/search", userAuth, upload.single("pdf"), geminiSearch);

module.exports = router;
