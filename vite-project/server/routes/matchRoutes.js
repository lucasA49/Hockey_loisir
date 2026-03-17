// server/routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const { requireAuth } = require("../middleware/auth");

router.get("/", matchController.getAllMatchs);
router.get("/:id", matchController.getMatchById);
router.post("/", requireAuth, matchController.createMatch);
router.put("/:id", requireAuth, matchController.updateMatch);
router.delete("/:id", requireAuth, matchController.deleteMatch);

module.exports = router;
