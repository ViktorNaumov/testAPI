const express = require("express");
const controller = require("./controllers");
const router = express.Router();

/**
 * @swagger
 * /api/login:
 * post:
 *  tags:
 *   - "login"
 */
router.post("/login", controller.login);
router.post("/registration", controller.register);
router.post("/sendMessage", controller.sendMessage);
router.get("/me", controller.me);
router.post("/correct", controller.correct);
router.post("/delete", controller.delete);

module.exports = router;
