// server/routes/licencieRoutes.js
const express = require("express");
const router = express.Router();
const licencieController = require("../controllers/licencieController");
const { requireAuth } = require("../middleware/auth");

router.get("/", licencieController.getAllLicencies);
router.get("/:id", licencieController.getLicencieById);
router.post("/", requireAuth, licencieController.createLicencie);
router.put("/:id", requireAuth, licencieController.updateLicencie);
router.delete("/:id", requireAuth, licencieController.deleteLicencie);

module.exports = router;
