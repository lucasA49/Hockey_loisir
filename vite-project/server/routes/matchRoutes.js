// server/routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const compositionController = require("../controllers/compositionController");
const { requireAuth } = require("../middleware/auth");

// Composition (joueurs + lignes) d'un match
router.get("/:id/composition", compositionController.getComposition);
router.put("/:id/composition", requireAuth, compositionController.saveComposition);
router.delete("/:id/composition", requireAuth, compositionController.deleteComposition);

router.get("/", matchController.getAllMatchs);
router.get("/:id", matchController.getMatchById);
router.post("/", requireAuth, matchController.createMatch);
router.put("/:id", requireAuth, matchController.updateMatch);
router.delete("/:id", requireAuth, matchController.deleteMatch);

module.exports = router;
