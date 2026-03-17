// server/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const licencieRoutes = require("./routes/licencieRoutes");
const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const evenementRoutes = require("./routes/evenementRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/licencies", licencieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matchs", matchRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
  res.send("API DOGZ Admin en ligne");
});

module.exports = app;
