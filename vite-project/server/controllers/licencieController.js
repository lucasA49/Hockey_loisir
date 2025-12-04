// server/controllers/licencieController.js
const licencieModel = require("../models/licencieModel");

function getAllLicencies(req, res) {
  try {
    const rows = licencieModel.getAllLicencies();
    return res.json(rows);
  } catch (err) {
    console.error("Erreur getAllLicencies:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function getLicencieById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const licencie = licencieModel.getLicencieById(id);
    if (!licencie) {
      return res.status(404).json({ message: "Licencié introuvable." });
    }

    return res.json(licencie);
  } catch (err) {
    console.error("Erreur getLicencieById:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function createLicencie(req, res) {
  try {
    const {
      prenom,
      nom,
      dateNaissance,
      licence,
      poste,
      telephone,
      statut,
    } = req.body || {};

    if (!prenom || !nom || !dateNaissance || !licence) {
      return res.status(400).json({
        message:
          "Champs requis : prenom, nom, dateNaissance, licence.",
      });
    }

    const licencie = licencieModel.createLicencie({
      prenom,
      nom,
      dateNaissance,
      licence,
      poste,
      telephone,
      statut,
    });

    return res.status(201).json(licencie);
  } catch (err) {
    console.error("Erreur createLicencie:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function updateLicencie(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const licencie = licencieModel.updateLicencie(id, req.body || {});
    if (!licencie) {
      return res.status(404).json({ message: "Licencié introuvable." });
    }

    return res.json(licencie);
  } catch (err) {
    console.error("Erreur updateLicencie:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function deleteLicencie(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const ok = licencieModel.deleteLicencie(id);
    if (!ok) {
      return res.status(404).json({ message: "Licencié introuvable." });
    }

    // 204 => pas de contenu
    return res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteLicencie:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  getAllLicencies,
  getLicencieById,
  createLicencie,
  updateLicencie,
  deleteLicencie,
};
