const express = require("express");
const router = express.Router();
const {findUserChats,findChat,createChat} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;