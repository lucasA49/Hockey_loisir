// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route de login admin
router.post("/login", authController.login);

module.exports = router;
