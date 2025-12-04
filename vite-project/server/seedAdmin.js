// server/seedAdmin.js
const adminModel = require("./models/adminModel");

async function main() {
  try {
    const email = "admin@dogz.local";      // tu pourras changer
    const password = "changemoi123";       // à changer après
    const nom = "Admin DOGZ";
    const role = "superadmin";

    const existing = adminModel.findByEmail(email);
    if (existing) {
      console.log("❌ Un admin avec cet email existe déjà :", existing.email);
      process.exit(0);
    }

    const admin = adminModel.createAdmin({ email, password, nom, role });
    console.log("✅ Admin créé :", admin);
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de la création de l'admin :", err);
    process.exit(1);
  }
}

main();
