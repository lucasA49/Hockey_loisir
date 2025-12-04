// server/routes/licencieRoutes.js
const express = require("express");
const router = express.Router();
const licencieController = require("../controllers/licencieController");

router.get("/", licencieController.getAllLicencies);
router.get("/:id", licencieController.getLicencieById);
router.post("/", licencieController.createLicencie);
router.put("/:id", licencieController.updateLicencie);
router.delete("/:id", licencieController.deleteLicencie);

module.exports = router;
