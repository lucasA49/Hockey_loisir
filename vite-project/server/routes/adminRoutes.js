// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAuth } = require("../middleware/auth");

// Toutes ces routes nécessitent d'être connecté
router.get("/", requireAuth, adminController.getAllAdmins);
router.post("/", requireAuth, adminController.createAdmin);
router.delete("/:id", requireAuth, adminController.deleteAdmin);

module.exports = router;
