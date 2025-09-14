const express = require("express");
const { googleSignIn, manualSignUp, manualSignIn, manualSignOut } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/signup", manualSignUp );  

authRouter.get("/auth/google" , googleSignIn );

authRouter.post("/login" , manualSignIn );

authRouter.post("/logout" , manualSignOut );

module.exports = authRouter;