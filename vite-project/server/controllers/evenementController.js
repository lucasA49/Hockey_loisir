// server/controllers/evenementController.js
const eventModel = require("../models/evenementModel");

// GET /api/evenements
function getAllEvenements(req, res) {
  try {
    const events = eventModel.getAllEvenements();
    res.json(events);
  } catch (err) {
    console.error("Erreur getAllEvenements:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// GET /api/evenements/:id
function getEvenement(req, res) {
  try {
    const id = Number(req.params.id);
    const event = eventModel.getEvenementById(id);

    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    res.json(event);
  } catch (err) {
    console.error("Erreur getEvenement:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// POST /api/evenements
function createEvenement(req, res) {
  try {
    const event = eventModel.createEvenement(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("Erreur createEvenement:", err);
    res.status(400).json({ message: err.message || "Données invalides." });
  }
}

// PUT /api/evenements/:id
function updateEvenement(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = eventModel.updateEvenement(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    res.json(updated);
  } catch (err) {
    console.error("Erreur updateEvenement:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// DELETE /api/evenements/:id
function deleteEvenement(req, res) {
  try {
    const id = Number(req.params.id);
    const ok = eventModel.deleteEvenement(id);

    if (!ok) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteEvenement:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  getAllEvenements,
  getEvenement,
  createEvenement,
  updateEvenement,
  deleteEvenement,
};
