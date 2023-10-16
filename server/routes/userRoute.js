const express = require("express");
const router = express.Router();
const {registerUser, loginUser, findOneUser, findUsers} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findOneUser);
router.get("/", findUsers);

module.exports = router;