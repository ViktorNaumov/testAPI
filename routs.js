const express = require("express");
const controller = require('./controllers')
const router = express.Router();



router.post("/login", controller.login);
router.post("/registration", controller.register);
router.post("/sendMessage",controller.sendMessage);
router.get("/me",controller.me);
router.post("/correct",controller.correct)

module.exports = router;