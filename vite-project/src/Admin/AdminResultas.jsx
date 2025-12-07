import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Users, Trophy, CalendarDays } from "lucide-react";

// URL de base de l'API (local ou Render)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

// URL finale pour les matchs
const API_URL = `${API_BASE_URL}/api/matchs`;

export default function AdminResultats() {
  const navBase =
    "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border";

  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    dateMatch: "",
    heure: "",
    adversaire: "",
    lieu: "",
    scoreDogz: "",
    scoreAdv: "",
    statut: "À venir",
  });

  // Charger les matchs depuis le backend
  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        setMatchs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les matchs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Ajout / édition
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.dateMatch || !formData.adversaire) {
      setError("Merci de renseigner au minimum la date et l’adversaire.");
      return;
    }

    try {
      let res;
      const payload = {
        ...formData,
        scoreDogz:
          formData.scoreDogz === "" ? null : Number(formData.scoreDogz),
        scoreAdv: formData.scoreAdv === "" ? null : Number(formData.scoreAdv),
      };

      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l’enregistrement.");
        return;
      }

      if (editingId) {
        setMatchs((prev) =>
          prev.map((m) => (m.id === editingId ? data : m))
        );
        setMessage("Match mis à jour.");
      } else {
        setMatchs((prev) => [data, ...prev]);
        setMessage("Match ajouté.");
      }

      setEditingId(null);
      setFormData({
        dateMatch: "",
        heure: "",
        adversaire: "",
        lieu: "",
        scoreDogz: "",
        scoreAdv: "",
        statut: "À venir",
      });
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleEdit = (match) => {
    setEditingId(match.id);
    setFormData({
      dateMatch: match.dateMatch || "",
      heure: match.heure || "",
      adversaire: match.adversaire || "",
      lieu: match.lieu || "",
      scoreDogz:
        match.scoreDogz === null || match.scoreDogz === undefined
          ? ""
          : String(match.scoreDogz),
      scoreAdv:
        match.scoreAdv === null || match.scoreAdv === undefined
          ? ""
          : String(match.scoreAdv),
      statut: match.statut || "À venir",
    });
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce match ?")) return;
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        setError("Erreur lors de la suppression.");
        return;
      }

      setMatchs((prev) => prev.filter((m) => m.id !== id));
      setMessage("Match supprimé.");
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      dateMatch: "",
      heure: "",
      adversaire: "",
      lieu: "",
      scoreDogz: "",
      scoreAdv: "",
      statut: "À venir",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      {/* Titre page admin */}
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Résultats</h1>

      {/* NAV ADMIN */}
      <nav className="w-full mb-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2">
          <p className="text-[11px] text-slate-500 px-1 mb-2">
            Navigation admin
          </p>

          <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:gap-3">
            <NavLink
              to="/admin/licencies"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span>Licenciés</span>
            </NavLink>

            <NavLink
              to="/admin/resultats"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <Trophy className="w-4 h-4" />
              <span>Résultats</span>
            </NavLink>

            <NavLink
              to="/admin/calendrier"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendrier</span>
            </NavLink>

            {/* Retour site */}
            <NavLink
              to="/"
              className={
                "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border " +
                "bg-slate-800/40 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
              }
            >
              ⬅️ <span>Retour site</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Gestion des matchs : ajout, mise à jour des scores, suppression.
      </p>

      {/* Messages */}
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

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* FORMULAIRE MATCH */}
        <section className="lg:col-span-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            {editingId ? "Modifier un match" : "Ajouter un match"}
          </h2>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Date du match</label>
              <input
                type="date"
                name="dateMatch"
                value={formData.dateMatch}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Heure</label>
              <input
                type="time"
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Adversaire</label>
              <input
                type="text"
                name="adversaire"
                placeholder="Angers, Nantes..."
                value={formData.adversaire}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Lieu</label>
              <input
                type="text"
                name="lieu"
                placeholder="Cholet, Angers..."
                value={formData.lieu}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-slate-400 text-[11px]">Score DOGZ</label>
                <input
                  type="number"
                  min="0"
                  name="scoreDogz"
                  value={formData.scoreDogz}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-slate-400 text-[11px]">
                  Score Adversaire
                </label>
                <input
                  type="number"
                  min="0"
                  name="scoreAdv"
                  value={formData.scoreAdv}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Statut</label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="À venir">À venir</option>
                <option value="Joué">Joué</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
              >
                {editingId ? "Mettre à jour" : "Ajouter le match"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTE MATCHS */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">
              Historique des matchs
            </h2>
            {loading && (
              <span className="text-[11px] text-slate-400">
                Chargement...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Heure</th>
                  <th className="py-2 pr-3">Adversaire</th>
                  <th className="py-2 pr-3">Lieu</th>
                  <th className="py-2 pr-3">Score</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matchs.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-4 text-center text-[11px] text-slate-500"
                    >
                      Aucun match enregistré pour le moment.
                    </td>
                  </tr>
                )}

                {matchs.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-800/60 last:border-b-0"
                  >
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {m.dateMatch || "-"}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {m.heure || "-"}
                    </td>
                    <td className="py-2 pr-3">{m.adversaire}</td>
                    <td className="py-2 pr-3">{m.lieu || "-"}</td>
                    <td className="py-2 pr-3">
                      {m.scoreDogz == null || m.scoreAdv == null
                        ? "-"
                        : `${m.scoreDogz} - ${m.scoreAdv}`}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                          m.statut === "Joué"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : m.statut === "Annulé"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {m.statut}
                      </span>
                    </td>
                    <td className="py-2 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(m)}
                        className="text-[11px] px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="text-[11px] px-2 py-1 rounded-lg border border-red-600 text-red-300 hover:bg-red-900/40"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
