// server/models/evenementModel.js
const db = require("../db");

// Récupérer tous les événements
function getAllEvenements() {
  const stmt = db.prepare(`
    SELECT
      id,
      date_event AS dateEvent,
      heure_event AS heure,
      titre,
      statut,
      type
    FROM evenements
    ORDER BY date_event ASC, heure_event ASC
  `);

  return stmt.all();
}

// Récupérer un événement par id
function getEvenementById(id) {
  const stmt = db.prepare(`
    SELECT
      id,
      date_event AS dateEvent,
      heure_event AS heure,
      titre,
      statut,
      type
    FROM evenements
    WHERE id = ?
  `);

  return stmt.get(id);
}

// Créer un événement
function createEvenement(data) {
  const { dateEvent, heure, titre, statut, type } = data;

  if (!dateEvent || !titre) {
    throw new Error("Champs obligatoires manquants (dateEvent, titre).");
  }

  // Valeur par défaut si le front n’envoie pas de type
  const safeType = type || "Match";

  const stmt = db.prepare(`
    INSERT INTO evenements (date_event, heure_event, titre, statut, type)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    dateEvent,
    heure || null,
    titre,
    statut || "Confirmé",
    safeType
  );

  return getEvenementById(info.lastInsertRowid);
}

// Mettre à jour un événement
function updateEvenement(id, data) {
  const existing = getEvenementById(id);
  if (!existing) return null;

  const updated = {
    dateEvent: data.dateEvent ?? existing.dateEvent,
    heure: data.heure ?? existing.heure,
    titre: data.titre ?? existing.titre,
    statut: data.statut ?? existing.statut,
    type: data.type ?? existing.type, // on garde le type existant si rien envoyé
  };

  const stmt = db.prepare(`
    UPDATE evenements
    SET date_event = ?, heure_event = ?, titre = ?, statut = ?, type = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.dateEvent,
    updated.heure,
    updated.titre,
    updated.statut,
    updated.type,
    id
  );

  return getEvenementById(id);
}

// Supprimer un événement
function deleteEvenement(id) {
  const stmt = db.prepare(`DELETE FROM evenements WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = {
  getAllEvenements,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement,
};
