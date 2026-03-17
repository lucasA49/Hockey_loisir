import { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/matchs`;

const STATUT_STYLE = {
  Joué:    "bg-emerald-500/15 text-emerald-300",
  Annulé:  "bg-red-500/15 text-red-300",
  "À venir": "bg-amber-500/15 text-amber-300",
};

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
  } catch { return d; }
};

export default function AdminResultats() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emptyForm = { dateMatch: "", heure: "", adversaire: "", lieu: "", scoreDogz: "", scoreAdv: "", statut: "À venir" };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((d) => setMatchs(Array.isArray(d) ? d : []))
      .catch(() => setError("Impossible de charger les matchs."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!formData.dateMatch || !formData.adversaire) {
      setError("Date et adversaire requis.");
      return;
    }

    try {
      const payload = {
        ...formData,
        scoreDogz: formData.scoreDogz === "" ? null : Number(formData.scoreDogz),
        scoreAdv:  formData.scoreAdv  === "" ? null : Number(formData.scoreAdv),
      };

      const res = editingId
        ? await authFetch(`${API_URL}/${editingId}`, { method: "PUT",  body: JSON.stringify(payload) })
        : await authFetch(API_URL,                   { method: "POST", body: JSON.stringify(payload) });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur lors de l'enregistrement."); return; }

      if (editingId) {
        setMatchs((p) => p.map((m) => (m.id === editingId ? data : m)));
        setMessage("Match mis à jour.");
      } else {
        setMatchs((p) => [data, ...p]);
        setMessage("Match ajouté.");
      }
      setEditingId(null);
      setFormData(emptyForm);
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setFormData({
      dateMatch: m.dateMatch || "",
      heure:     m.heure     || "",
      adversaire: m.adversaire || "",
      lieu:      m.lieu      || "",
      scoreDogz: m.scoreDogz == null ? "" : String(m.scoreDogz),
      scoreAdv:  m.scoreAdv  == null ? "" : String(m.scoreAdv),
      statut:    m.statut    || "À venir",
    });
    setError(""); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce match ?")) return;
    setError(""); setMessage("");
    try {
      const res = await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) { setError("Erreur lors de la suppression."); return; }
      setMatchs((p) => p.filter((m) => m.id !== id));
      setMessage("Match supprimé.");
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleCancelEdit = () => { setEditingId(null); setFormData(emptyForm); };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Résultats</h1>
      <AdminNav />
      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Ajoutez les matchs ici : ils apparaîtront automatiquement sur le site public.
      </p>

      {error   && <div className="mb-3 text-xs text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="mb-3 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">

        {/* ─── FORMULAIRE ─── */}
        <section className="lg:col-span-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            {editingId ? "✏️ Modifier un match" : "➕ Ajouter un match"}
          </h2>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-slate-400">Date du match *</label>
                <input type="date" name="dateMatch" value={formData.dateMatch} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Heure</label>
                <input type="time" name="heure" value={formData.heure} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                  <option value="À venir">À venir</option>
                  <option value="Joué">Joué</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-slate-400">Adversaire *</label>
                <input type="text" name="adversaire" placeholder="Angers, Nantes..." value={formData.adversaire} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-slate-400">Lieu</label>
                <input type="text" name="lieu" placeholder="Cholet, Angers..." value={formData.lieu} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>

            {/* Scores */}
            <div>
              <p className="text-slate-400 mb-1">Score (si match joué)</p>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1 flex-1 text-center">
                  <label className="text-[11px] text-slate-500">DOGZ</label>
                  <input type="number" min="0" name="scoreDogz" value={formData.scoreDogz} onChange={handleChange}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
                <span className="text-slate-500 text-sm mt-4">–</span>
                <div className="flex flex-col gap-1 flex-1 text-center">
                  <label className="text-[11px] text-slate-500">Adv.</label>
                  <input type="number" min="0" name="scoreAdv" value={formData.scoreAdv} onChange={handleChange}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 font-semibold rounded-lg py-2.5 transition text-xs md:text-sm">
                {editingId ? "Mettre à jour" : "Ajouter le match"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 font-semibold rounded-lg py-2.5 transition text-xs md:text-sm">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ─── LISTE DES MATCHS ─── */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-semibold">
              Tous les matchs
            </h2>
            {loading
              ? <span className="text-[11px] text-slate-400">Chargement...</span>
              : <span className="text-[11px] text-slate-500">{matchs.length} match{matchs.length > 1 ? "s" : ""}</span>
            }
          </div>

          {/* VERSION MOBILE : cards */}
          <div className="lg:hidden space-y-3">
            {matchs.length === 0 && !loading && (
              <p className="text-center text-[11px] text-slate-500 py-4">Aucun match enregistré.</p>
            )}
            {matchs.map((m) => (
              <div key={m.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                {/* Ligne 1 : date + statut */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-200">
                    {formatDate(m.dateMatch)}
                    {m.heure && <span className="text-slate-400 font-normal"> · {m.heure}</span>}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUT_STYLE[m.statut] || "bg-slate-700 text-slate-300"}`}>
                    {m.statut}
                  </span>
                </div>

                {/* Ligne 2 : DOGZ vs Adversaire + score */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold">
                    DOGZ <span className="text-slate-400 font-normal">vs</span> {m.adversaire}
                  </p>
                  {m.scoreDogz != null && m.scoreAdv != null && (
                    <span className="text-sm font-bold text-red-400">
                      {m.scoreDogz} – {m.scoreAdv}
                    </span>
                  )}
                </div>

                {/* Ligne 3 : lieu */}
                {m.lieu && (
                  <p className="text-[11px] text-slate-500 mb-2">{m.lieu}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => handleEdit(m)}
                    className="flex-1 text-[11px] py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 transition text-center">
                    Modifier
                  </button>
                  <button type="button" onClick={() => handleDelete(m.id)}
                    className="flex-1 text-[11px] py-1.5 rounded-lg border border-red-600 text-red-300 hover:bg-red-900/30 transition text-center">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* VERSION DESKTOP : tableau */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Heure</th>
                  <th className="py-2 pr-3 font-medium">Adversaire</th>
                  <th className="py-2 pr-3 font-medium">Lieu</th>
                  <th className="py-2 pr-3 font-medium">Score</th>
                  <th className="py-2 pr-3 font-medium">Statut</th>
                  <th className="py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matchs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-[11px] text-slate-500">
                      Aucun match enregistré.
                    </td>
                  </tr>
                )}
                {matchs.map((m) => (
                  <tr key={m.id} className="border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/30 transition">
                    <td className="py-2.5 pr-3 whitespace-nowrap">{formatDate(m.dateMatch)}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-slate-400">{m.heure || "–"}</td>
                    <td className="py-2.5 pr-3 font-medium">{m.adversaire}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{m.lieu || "–"}</td>
                    <td className="py-2.5 pr-3 font-bold text-red-400 whitespace-nowrap">
                      {m.scoreDogz == null || m.scoreAdv == null ? "–" : `${m.scoreDogz} – ${m.scoreAdv}`}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUT_STYLE[m.statut] || "bg-slate-700 text-slate-300"}`}>
                        {m.statut}
                      </span>
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button type="button" onClick={() => handleEdit(m)}
                        className="text-[11px] px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 mr-1 transition">
                        Modifier
                      </button>
                      <button type="button" onClick={() => handleDelete(m.id)}
                        className="text-[11px] px-2 py-1 rounded-lg border border-red-600 text-red-300 hover:bg-red-900/40 transition">
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
