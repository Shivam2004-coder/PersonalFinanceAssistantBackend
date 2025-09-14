const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { searchForGraphs } = require("../controllers/graphController");
const graphRouter = express.Router();

graphRouter.get("/graph" , userAuth , searchForGraphs );

module.exports = graphRouter;