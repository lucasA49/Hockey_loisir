// server/controllers/compositionController.js
const matchModel = require("../models/matchModel");
const compositionModel = require("../models/compositionModel");

const MAX_LIGNES = 6;
const MAX_JOUEURS_PAR_LIGNE = 5;
const MAX_LONGUEUR_PRENOM = 40;

// Vérifie l'id et l'existence du match, renvoie l'id ou null (réponse déjà envoyée)
function resolveMatch(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: "ID invalide." });
    return null;
  }
  if (!matchModel.getMatchById(id)) {
    res.status(404).json({ message: "Match introuvable." });
    return null;
  }
  return id;
}

// Nettoie et valide une catégorie : tableau de lignes, chaque ligne = tableau de prénoms
function normaliserLignes(lignes, nom) {
  if (lignes === undefined) return { lignes: [] };
  if (!Array.isArray(lignes)) return { error: `"${nom}" doit être un tableau de lignes.` };
  if (lignes.length > MAX_LIGNES) return { error: `${MAX_LIGNES} lignes maximum en ${nom}.` };

  const result = [];
  for (const ligne of lignes) {
    if (!Array.isArray(ligne)) return { error: `Chaque ligne de "${nom}" doit être un tableau de prénoms.` };

    const prenoms = ligne
      .filter((p) => typeof p === "string")
      .map((p) => p.trim())
      .filter(Boolean);

    if (prenoms.length > MAX_JOUEURS_PAR_LIGNE) {
      return { error: `${MAX_JOUEURS_PAR_LIGNE} joueurs maximum par ligne (${nom}).` };
    }
    if (prenoms.some((p) => p.length > MAX_LONGUEUR_PRENOM)) {
      return { error: `Prénom trop long (${MAX_LONGUEUR_PRENOM} caractères max).` };
    }

    // On ignore les lignes vides
    if (prenoms.length > 0) result.push(prenoms);
  }
  return { lignes: result };
}

function getComposition(req, res) {
  try {
    const id = resolveMatch(req, res);
    if (!id) return;
    return res.json(compositionModel.getComposition(id));
  } catch (err) {
    console.error("Erreur getComposition:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function saveComposition(req, res) {
  try {
    const id = resolveMatch(req, res);
    if (!id) return;

    const body = req.body || {};
    const composition = {};

    for (const cle of ["attaque", "defense", "gardiens"]) {
      const { lignes, error } = normaliserLignes(body[cle], cle);
      if (error) return res.status(400).json({ message: error });
      composition[cle] = lignes;
    }

    compositionModel.saveComposition(id, composition);
    return res.json(compositionModel.getComposition(id));
  } catch (err) {
    console.error("Erreur saveComposition:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

function deleteComposition(req, res) {
  try {
    const id = resolveMatch(req, res);
    if (!id) return;

    const ok = compositionModel.deleteComposition(id);
    if (!ok) {
      return res.status(404).json({ message: "Aucune composition pour ce match." });
    }
    return res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteComposition:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  getComposition,
  saveComposition,
  deleteComposition,
};
