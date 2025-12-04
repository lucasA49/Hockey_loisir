// server/models/matchModel.js
const db = require("../db");

// Récupérer tous les matchs
function getAllMatchs() {
  const stmt = db.prepare(`
    SELECT
      id,
      date_match AS dateMatch,
      heure_match AS heure,
      adversaire,
      lieu,
      score_dogz AS scoreDogz,
      score_adv AS scoreAdv,
      statut
    FROM matchs
    ORDER BY date_match DESC, heure_match DESC
  `);

  return stmt.all();
}

// Récupérer un match par id
function getMatchById(id) {
  const stmt = db.prepare(`
    SELECT
      id,
      date_match AS dateMatch,
      heure_match AS heure,
      adversaire,
      lieu,
      score_dogz AS scoreDogz,
      score_adv AS scoreAdv,
      statut
    FROM matchs
    WHERE id = ?
  `);

  return stmt.get(id);
}

// Créer un match
function createMatch(data) {
  const {
    dateMatch,
    heure,
    adversaire,
    lieu,
    scoreDogz,
    scoreAdv,
    statut,
  } = data;

  const stmt = db.prepare(`
    INSERT INTO matchs (date_match, heure_match, adversaire, lieu, score_dogz, score_adv, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    dateMatch,
    heure || "",              // heure_match est NOT NULL → on envoie au moins une string vide
    adversaire,
    lieu || null,
    scoreDogz ?? null,
    scoreAdv ?? null,
    statut || "À venir"
  );

  return getMatchById(info.lastInsertRowid);
}

// Mettre à jour un match
function updateMatch(id, data) {
  const existing = getMatchById(id);
  if (!existing) return null;

  const updated = {
    dateMatch: data.dateMatch ?? existing.dateMatch,
    heure: data.heure ?? existing.heure,
    adversaire: data.adversaire ?? existing.adversaire,
    lieu: data.lieu ?? existing.lieu,
    scoreDogz:
      data.scoreDogz !== undefined ? data.scoreDogz : existing.scoreDogz,
    scoreAdv:
      data.scoreAdv !== undefined ? data.scoreAdv : existing.scoreAdv,
    statut: data.statut ?? existing.statut,
  };

  const stmt = db.prepare(`
    UPDATE matchs
    SET date_match = ?, heure_match = ?, adversaire = ?, lieu = ?, score_dogz = ?, score_adv = ?, statut = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.dateMatch,
    updated.heure || "",
    updated.adversaire,
    updated.lieu,
    updated.scoreDogz,
    updated.scoreAdv,
    updated.statut,
    id
  );

  return getMatchById(id);
}

// Supprimer un match
function deleteMatch(id) {
  const stmt = db.prepare(`DELETE FROM matchs WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = {
  getAllMatchs,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
