// server/controllers/authController.js
const adminModel = require("../models/adminModel");

// POST /api/auth/login
function login(req, res) {
  try {
    console.log("➡️ Requête login reçue, body:", req.body);

    const { email, password } = req.body || {};

    // Vérif basique
    if (!email || !password) {
      console.log("❌ Email ou mot de passe manquant");
      return res
        .status(400)
        .json({ message: "Email et mot de passe obligatoires." });
    }

    const admin = adminModel.findByEmail(email);
    if (!admin) {
      console.log("❌ Admin introuvable pour l'email:", email);
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const isValid = adminModel.verifyPassword(password, admin.motDePasse);
    if (!isValid) {
      console.log("❌ Mot de passe invalide pour:", email);
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    console.log("✅ Connexion réussie pour:", email);

    // OK : on renvoie les infos utiles (sans mot de passe)
    return res.json({
      message: "Connexion réussie",
      admin: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("💥 Erreur login admin :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur.", error: err.message });
  }
}

module.exports = {
  login,
};
