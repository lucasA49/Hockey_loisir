// server/models/compositionModel.js
const db = require("../db");

// Clé de catégorie en base → clé dans l'API
const CATEGORIES = {
  attaque: "attaque",
  defense: "defense",
  gardien: "gardiens",
};

// Récupérer la composition d'un match
// Format : { attaque: [["Lucas", "Tom", "Max"], ...], defense: [[...]], gardiens: [[...]], joueurs: [...] }
function getComposition(matchId) {
  const rows = db.prepare(`
    SELECT l.categorie, l.numero, j.prenom
    FROM match_lignes l
    LEFT JOIN match_ligne_joueurs j ON j.ligne_id = l.id
    WHERE l.match_id = ?
    ORDER BY l.categorie, l.numero, j.ordre
  `).all(matchId);

  const composition = { attaque: [], defense: [], gardiens: [] };

  rows.forEach((r) => {
    const lignes = composition[CATEGORIES[r.categorie]];
    const index = r.numero - 1;
    if (!lignes[index]) lignes[index] = [];
    if (r.prenom) lignes[index].push(r.prenom);
  });

  // Les numéros sont contigus (réécrits à chaque sauvegarde), mais on sécurise
  Object.keys(composition).forEach((k) => {
    composition[k] = composition[k].filter(Boolean);
  });

  const joueurs = [
    ...new Set(
      [...composition.attaque, ...composition.defense, ...composition.gardiens].flat()
    ),
  ];

  return { ...composition, joueurs };
}

// Remplacer entièrement la composition d'un match (transaction)
const saveComposition = db.transaction((matchId, composition) => {
  db.prepare(`DELETE FROM match_lignes WHERE match_id = ?`).run(matchId);

  const insertLigne = db.prepare(`
    INSERT INTO match_lignes (match_id, categorie, numero) VALUES (?, ?, ?)
  `);
  const insertJoueur = db.prepare(`
    INSERT INTO match_ligne_joueurs (ligne_id, prenom, ordre) VALUES (?, ?, ?)
  `);

  Object.entries(CATEGORIES).forEach(([categorie, cle]) => {
    composition[cle].forEach((joueurs, i) => {
      const { lastInsertRowid } = insertLigne.run(matchId, categorie, i + 1);
      joueurs.forEach((prenom, ordre) => insertJoueur.run(lastInsertRowid, prenom, ordre));
    });
  });
});

// Supprimer la composition d'un match
function deleteComposition(matchId) {
  const info = db.prepare(`DELETE FROM match_lignes WHERE match_id = ?`).run(matchId);
  return info.changes > 0;
}

module.exports = {
  getComposition,
  saveComposition,
  deleteComposition,
};
