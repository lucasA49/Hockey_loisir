// server/models/licencieModel.js
const db = require("../db");

// Récupérer tous les licenciés
function getAllLicencies() {
  const stmt = db.prepare(`
    SELECT
      id,
      prenom,
      nom,
      date_naissance AS dateNaissance,
      licence,
      poste,
      telephone,
      statut
    FROM licencies
    ORDER BY nom, prenom
  `);

  return stmt.all();
}

// Récupérer un licencié par id
function getLicencieById(id) {
  const stmt = db.prepare(`
    SELECT
      id,
      prenom,
      nom,
      date_naissance AS dateNaissance,
      licence,
      poste,
      telephone,
      statut
    FROM licencies
    WHERE id = ?
  `);

  return stmt.get(id);
}

// Créer un licencié
function createLicencie(data) {
  const {
    prenom,
    nom,
    dateNaissance,
    licence,
    poste,
    telephone,
    statut,
  } = data;

  const stmt = db.prepare(`
    INSERT INTO licencies (prenom, nom, date_naissance, licence, poste, telephone, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    prenom,
    nom,
    dateNaissance,
    licence,
    poste || null,
    telephone || null,
    statut || "Actif"
  );

  return getLicencieById(info.lastInsertRowid);
}

// Mettre à jour un licencié
function updateLicencie(id, data) {
  const existing = getLicencieById(id);
  if (!existing) return null;

  const updated = {
    prenom: data.prenom ?? existing.prenom,
    nom: data.nom ?? existing.nom,
    dateNaissance: data.dateNaissance ?? existing.dateNaissance,
    licence: data.licence ?? existing.licence,
    poste: data.poste ?? existing.poste,
    telephone: data.telephone ?? existing.telephone,
    statut: data.statut ?? existing.statut,
  };

  const stmt = db.prepare(`
    UPDATE licencies
    SET prenom = ?, nom = ?, date_naissance = ?, licence = ?, poste = ?, telephone = ?, statut = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.prenom,
    updated.nom,
    updated.dateNaissance,
    updated.licence,
    updated.poste,
    updated.telephone,
    updated.statut,
    id
  );

  return getLicencieById(id);
}

// Supprimer un licencié
function deleteLicencie(id) {
  const stmt = db.prepare(`DELETE FROM licencies WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = {
  getAllLicencies,
  getLicencieById,
  createLicencie,
  updateLicencie,
  deleteLicencie,
};
