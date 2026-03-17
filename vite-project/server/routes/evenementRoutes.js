// server/routes/evenementRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/evenementController");
const { requireAuth } = require("../middleware/auth");

router.get("/", eventController.getAllEvenements);
router.get("/:id", eventController.getEvenement);
router.post("/", requireAuth, eventController.createEvenement);
router.put("/:id", requireAuth, eventController.updateEvenement);
router.delete("/:id", requireAuth, eventController.deleteEvenement);

module.exports = router;
