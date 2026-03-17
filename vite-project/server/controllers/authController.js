// server/controllers/authController.js
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");

// POST /api/auth/login
function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe obligatoires." });
    }

    const admin = adminModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const isValid = adminModel.verifyPassword(password, admin.motDePasse);
    if (!isValid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Connexion réussie",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        role: admin.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
}

module.exports = { login };
