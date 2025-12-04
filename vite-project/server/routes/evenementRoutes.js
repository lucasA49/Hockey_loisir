// server/routes/evenementRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/evenementController");

// /api/evenements
router.get("/", eventController.getAllEvenements);
router.get("/:id", eventController.getEvenement);
router.post("/", eventController.createEvenement);
router.put("/:id", eventController.updateEvenement);
router.delete("/:id", eventController.deleteEvenement);

module.exports = router;
