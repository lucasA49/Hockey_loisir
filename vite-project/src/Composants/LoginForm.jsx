// src/Pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = `${API_BASE_URL}/api/auth/login`;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.email || !formData.password) {
      setError("Merci de remplir l’email et le mot de passe.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiants invalides.");
        return;
      }

      // Connexion OK → on peut stocker l'admin dans le localStorage
      localStorage.setItem("dogz_admin", JSON.stringify(data.admin));
      setSuccessMsg("Connexion réussie, redirection…");

      // Redirection vers le dashboard admin
      setTimeout(() => {
        navigate("/admindashboard");
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40">
        <div className="mb-5 text-center">
          <p className="text-[11px] uppercase tracking-wide text-red-400 mb-1">
            DOGZ CHOLET – Panel Admin
          </p>
          <h1 className="text-xl md:text-2xl font-bold">Connexion admin</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Accès réservé aux membres du staff.
          </p>
        </div>

        {error && (
          <div className="mb-3 text-xs md:text-sm text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 text-xs md:text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">
            {successMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs md:text-sm text-slate-300"
            >
              Email admin
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="admin@dogz.local"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs md:text-sm text-slate-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="••••••••••"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm md:text-base font-semibold rounded-lg py-2.5 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 mt-4 text-center">
          Besoin d’un accès ? Contactez le responsable de l’équipe.
        </p>
      </div>
    </div>
  );
}
