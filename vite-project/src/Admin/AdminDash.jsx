import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_LICENCIES = `${API_BASE_URL}/api/licencies`;
const API_MATCHS = `${API_BASE_URL}/api/matchs`;
const API_EVENEMENTS = `${API_BASE_URL}/api/evenements`;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [licencies, setLicencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [scoreForm, setScoreForm] = useState({ dateMatch: "", adversaire: "", scoreDogz: "", scoreAdv: "" });
  const [scoreMsg, setScoreMsg] = useState("");
  const [scoreError, setScoreError] = useState("");

  const [eventForm, setEventForm] = useState({ dateEvent: "", heure: "", titre: "", statut: "Confirmé" });
  const [eventMsg, setEventMsg] = useState("");
  const [eventError, setEventError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("dogz_token");
    localStorage.removeItem("dogz_admin");
    navigate("/admin");
  };

  useEffect(() => {
    const fetchLicencies = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_LICENCIES);
        const data = await res.json();
        setLicencies(Array.isArray(data) ? data : []);
      } catch {
        setError("Impossible de charger les licenciés.");
      } finally {
        setLoading(false);
      }
    };
    fetchLicencies();
  }, []);

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setScoreForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setScoreMsg("");
    setScoreError("");

    if (!scoreForm.dateMatch || !scoreForm.adversaire) {
      setScoreError("Date et adversaire requis.");
      return;
    }

    try {
      const payload = {
        dateMatch: scoreForm.dateMatch,
        adversaire: scoreForm.adversaire,
        scoreDogz: scoreForm.scoreDogz === "" ? null : Number(scoreForm.scoreDogz),
        scoreAdv: scoreForm.scoreAdv === "" ? null : Number(scoreForm.scoreAdv),
        statut: "Joué",
      };
      const res = await authFetch(API_MATCHS, { method: "POST", body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        setScoreError(data.message || "Erreur lors de l'enregistrement.");
        return;
      }
      setScoreMsg("Match enregistré avec succès.");
      setScoreForm({ dateMatch: "", adversaire: "", scoreDogz: "", scoreAdv: "" });
    } catch {
      setScoreError("Erreur de communication avec le serveur.");
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setEventMsg("");
    setEventError("");

    if (!eventForm.dateEvent || !eventForm.titre) {
      setEventError("Date et titre requis.");
      return;
    }

    try {
      const payload = {
        dateEvent: eventForm.dateEvent,
        heure: eventForm.heure || null,
        titre: eventForm.titre,
        statut: eventForm.statut || "Confirmé",
      };
      const res = await authFetch(API_EVENEMENTS, { method: "POST", body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        setEventError(data.message || "Erreur lors de l'enregistrement.");
        return;
      }
      setEventMsg("Événement ajouté avec succès.");
      setEventForm({ dateEvent: "", heure: "", titre: "", statut: "Confirmé" });
    } catch {
      setEventError("Erreur de communication avec le serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl md:text-2xl font-bold">Panel Admin</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 hover:text-white transition"
        >
          Déconnexion
        </button>
      </div>

      <AdminNav />

      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Gestion des licenciés, résultats et calendrier.
      </p>

      {error && (
        <div className="mb-3 text-xs md:text-sm text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* LICENCIÉS (2/3) */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">Licenciés de l'équipe</h2>
            {loading && <span className="text-[11px] text-slate-400">Chargement...</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-4">N° licence</th>
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {licencies.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/60 last:border-b-0">
                    <td className="py-2 pr-4 whitespace-nowrap">{p.licence}</td>
                    <td className="py-2 pr-4">{p.prenom} {p.nom}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                        p.statut === "Actif" ? "bg-emerald-500/15 text-emerald-300"
                        : p.statut === "Blessé" ? "bg-red-500/15 text-red-300"
                        : "bg-amber-500/15 text-amber-300"
                      }`}>
                        {p.statut || "Actif"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && licencies.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-[11px] text-slate-500">
                      Aucun licencié pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* COLONNE DE DROITE */}
        <div className="flex flex-col gap-4">
          {/* FORMULAIRE SCORE */}
          <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-3">Enregistrer un score</h2>

            {scoreError && <p className="text-[11px] text-red-300 mb-2">{scoreError}</p>}
            {scoreMsg && <p className="text-[11px] text-emerald-300 mb-2">{scoreMsg}</p>}

            <form className="space-y-3 text-xs md:text-sm" onSubmit={handleScoreSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Date du match</label>
                <input type="date" name="dateMatch" value={scoreForm.dateMatch} onChange={handleScoreChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Adversaire</label>
                <input type="text" name="adversaire" placeholder="Nom de l'équipe" value={scoreForm.adversaire} onChange={handleScoreChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-slate-400 text-[11px]">DOGZ</label>
                  <input type="number" min="0" name="scoreDogz" value={scoreForm.scoreDogz} onChange={handleScoreChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
                <span className="text-slate-400 text-xs mt-4">-</span>
                <div className="flex-1">
                  <label className="text-slate-400 text-[11px]">Adversaire</label>
                  <input type="number" min="0" name="scoreAdv" value={scoreForm.scoreAdv} onChange={handleScoreChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-xs md:text-sm font-semibold rounded-lg py-2 transition">
                Enregistrer
              </button>
            </form>
          </section>

          {/* FORMULAIRE ÉVÉNEMENTS */}
          <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-3">Ajouter un événement</h2>

            {eventError && <p className="text-[11px] text-red-300 mb-2">{eventError}</p>}
            {eventMsg && <p className="text-[11px] text-emerald-300 mb-2">{eventMsg}</p>}

            <form className="space-y-3 text-xs md:text-sm" onSubmit={handleEventSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Date</label>
                <input type="date" name="dateEvent" value={eventForm.dateEvent} onChange={handleEventChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Heure</label>
                <input type="time" name="heure" value={eventForm.heure} onChange={handleEventChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Titre / Match</label>
                <input type="text" name="titre" placeholder="Match vs Angers, déplacement..." value={eventForm.titre} onChange={handleEventChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Statut</label>
                <select name="statut" value={eventForm.statut} onChange={handleEventChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                  <option value="Confirmé">Confirmé</option>
                  <option value="À confirmer">À confirmer</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition">
                Ajouter
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
