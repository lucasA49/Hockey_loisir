// server/controllers/matchController.js
const matchModel = require("../models/matchModel");

const NIVEAUX = ["Débutant", "Intermédiaire", "Confirmé"];

// Le niveau est optionnel : vide/null = non précisé
function niveauInvalide(niveau) {
  return niveau !== undefined && niveau !== null && niveau !== "" && !NIVEAUX.includes(niveau);
}

function getAllMatchs(req, res) {
  try {
    const rows = matchModel.getAllMatchs();
    return res.json(rows);
  } catch (err) {
    console.error("Erreur getAllMatchs:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function getMatchById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const match = matchModel.getMatchById(id);
    if (!match) {
      return res.status(404).json({ message: "Match introuvable." });
    }

    return res.json(match);
  } catch (err) {
    console.error("Erreur getMatchById:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function createMatch(req, res) {
  try {
    const {
      dateMatch,
      heure,
      adversaire,
      lieu,
      scoreDogz,
      scoreAdv,
      statut,
      niveau,
    } = req.body || {};

    if (!dateMatch || !adversaire) {
      return res.status(400).json({
        message: "Champs requis : dateMatch, adversaire.",
      });
    }
    if (niveauInvalide(niveau)) {
      return res.status(400).json({ message: `Niveau invalide (${NIVEAUX.join(", ")}).` });
    }

    const match = matchModel.createMatch({
      dateMatch,
      heure,
      adversaire,
      lieu,
      scoreDogz,
      scoreAdv,
      statut,
      niveau,
    });

    return res.status(201).json(match);
  } catch (err) {
    console.error("Erreur createMatch:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function updateMatch(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    if (niveauInvalide(req.body?.niveau)) {
      return res.status(400).json({ message: `Niveau invalide (${NIVEAUX.join(", ")}).` });
    }

    const match = matchModel.updateMatch(id, req.body || {});
    if (!match) {
      return res.status(404).json({ message: "Match introuvable." });
    }

    return res.json(match);
  } catch (err) {
    console.error("Erreur updateMatch:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function deleteMatch(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const ok = matchModel.deleteMatch(id);
    if (!ok) {
      return res.status(404).json({ message: "Match introuvable." });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteMatch:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  getAllMatchs,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
