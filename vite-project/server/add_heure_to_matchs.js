// server/add_heure_to_matchs.js
const db = require("./db");

try {
  db.prepare("ALTER TABLE matchs ADD COLUMN heure TEXT;").run();
  console.log("✅ Colonne 'heure' ajoutée à la table 'matchs'.");
} catch (err) {
  console.error("❌ Erreur lors de l'ajout de la colonne 'heure':", err.message);
}
