import { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/admins`;

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(d));
  } catch {
    return d;
  }
};

export default function AdminComptes() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [formLoading, setFormLoading] = useState(false);

  // L'admin connecté (pour ne pas pouvoir se supprimer)
  const currentAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("dogz_admin") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await authFetch(API_URL);
        const data = await res.json();
        setAdmins(Array.isArray(data) ? data : []);
      } catch {
        setError("Impossible de charger les comptes.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.email || !formData.password) {
      setError("Email et mot de passe obligatoires.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setFormLoading(true);
      const res = await authFetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nom: formData.nom || null,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de la création du compte.");
        return;
      }

      setAdmins((prev) => [...prev, data]);
      setMessage(`Compte créé avec succès pour ${data.email}.`);
      setFormData({ nom: "", email: "", password: "", confirmPassword: "", role: "admin" });
    } catch {
      setError("Erreur de communication avec le serveur.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Supprimer le compte de ${admin.nom || admin.email} ?`)) return;
    setError("");
    setMessage("");

    try {
      const res = await authFetch(`${API_URL}/${admin.id}`, { method: "DELETE" });

      if (res.status === 403) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      if (!res.ok && res.status !== 204) {
        setError("Erreur lors de la suppression.");
        return;
      }

      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      setMessage(`Compte de ${admin.nom || admin.email} supprimé.`);
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Gestion des comptes</h1>

      <AdminNav />

      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Créez et gérez les accès au panel admin pour votre staff.
      </p>

      {error && (
        <div className="mb-3 text-xs md:text-sm text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-3 text-xs md:text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* FORMULAIRE CRÉATION */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-1">Créer un compte</h2>
          <p className="text-[11px] text-slate-500 mb-4">
            Le nouveau membre recevra ses identifiants pour accéder au panel admin.
          </p>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="nom">
                Nom (optionnel)
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Jean Dupont"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="email">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@dogz.local"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="role">
                Rôle
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="password">
                Mot de passe <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8 caractères minimum"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="confirmPassword">
                Confirmer le mot de passe <span className="text-red-400">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        formData.password.length >= level * 3
                          ? level <= 1
                            ? "bg-red-500"
                            : level <= 2
                            ? "bg-orange-400"
                            : level <= 3
                            ? "bg-yellow-400"
                            : "bg-emerald-400"
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  {formData.password.length < 8
                    ? "Trop court"
                    : formData.password.length < 10
                    ? "Acceptable"
                    : formData.password.length < 12
                    ? "Bon"
                    : "Très bon"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-xs md:text-sm font-semibold rounded-lg py-2.5 transition"
            >
              {formLoading ? "Création..." : "Créer le compte"}
            </button>
          </form>
        </section>

        {/* LISTE DES COMPTES */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">Comptes existants</h2>
            {loading && <span className="text-[11px] text-slate-400">Chargement...</span>}
            {!loading && (
              <span className="text-[11px] text-slate-500">
                {admins.length} compte{admins.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {!loading && admins.length === 0 && (
              <p className="text-center text-[11px] text-slate-500 py-4">
                Aucun compte pour le moment.
              </p>
            )}

            {admins.map((admin) => {
              const isCurrentUser = admin.id === currentAdmin.id;
              return (
                <div
                  key={admin.id}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 border ${
                    isCurrentUser
                      ? "bg-red-950/20 border-red-800/40"
                      : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs md:text-sm font-semibold truncate">
                        {admin.nom || "—"}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          admin.role === "superadmin"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {admin.role}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full">
                          vous
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{admin.email}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Créé le {formatDate(admin.dateCreation)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(admin)}
                    disabled={isCurrentUser}
                    title={isCurrentUser ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer ce compte"}
                    className={`ml-3 shrink-0 text-[11px] px-3 py-1 rounded-full border transition ${
                      isCurrentUser
                        ? "border-slate-700 text-slate-600 cursor-not-allowed"
                        : "border-red-500 text-red-300 hover:bg-red-950/40"
                    }`}
                  >
                    Supprimer
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
