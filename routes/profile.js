const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { profileView } = require("../controllers/profileController");
const profileRouter = express.Router();

profileRouter.get("/profile/view" , userAuth , profileView );

module.exports = profileRouter;