import { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/licencies`;

const STATUT_STYLE = {
  Actif:  "bg-emerald-500/15 text-emerald-300",
  Blessé: "bg-red-500/15 text-red-300",
  Repos:  "bg-amber-500/15 text-amber-300",
};

export default function AdminLicencies() {
  const [licencies,  setLicencies]  = useState([]);
  const [formData,   setFormData]   = useState({ prenom: "", nom: "", dateNaissance: "", licence: "", poste: "", telephone: "", statut: "Actif" });
  const [editingId,  setEditingId]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [message,    setMessage]    = useState("");
  const [error,      setError]      = useState("");

  useEffect(() => {
    const fetchLicencies = async () => {
      try {
        setLoading(true);
        const res  = await fetch(API_URL);
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

  const resetForm = () => {
    setFormData({ prenom: "", nom: "", dateNaissance: "", licence: "", poste: "", telephone: "", statut: "Actif" });
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!formData.prenom || !formData.nom || !formData.dateNaissance || !formData.licence) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    try {
      const payload = {
        prenom: formData.prenom, nom: formData.nom,
        dateNaissance: formData.dateNaissance, licence: formData.licence,
        poste: formData.poste || null, telephone: formData.telephone || null,
        statut: formData.statut || "Actif",
      };

      const res = editingId
        ? await authFetch(`${API_URL}/${editingId}`, { method: "PUT",  body: JSON.stringify(payload) })
        : await authFetch(API_URL,                   { method: "POST", body: JSON.stringify(payload) });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur lors de l'enregistrement."); return; }

      if (editingId) {
        setLicencies((prev) => prev.map((lic) => (lic.id === editingId ? data : lic)));
        setMessage("Licencié mis à jour.");
      } else {
        setLicencies((prev) => [...prev, data]);
        setMessage("Licencié ajouté.");
      }
      resetForm();
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleEdit = (lic) => {
    setEditingId(lic.id);
    setFormData({
      prenom: lic.prenom || "", nom: lic.nom || "",
      dateNaissance: lic.dateNaissance || "", licence: lic.licence || "",
      poste: lic.poste || "", telephone: lic.telephone || "",
      statut: lic.statut || "Actif",
    });
    setError(""); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce licencié ?")) return;
    setError(""); setMessage("");
    try {
      const res = await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) { setError("Erreur lors de la suppression."); return; }
      setLicencies((prev) => prev.filter((lic) => lic.id !== id));
      setMessage("Licencié supprimé.");
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Licenciés</h1>
      <AdminNav />
      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Ajout, modification et suppression des licenciés de l&apos;équipe.
      </p>

      {error   && <div className="mb-3 text-xs text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="mb-3 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">

        {/* ─── FORMULAIRE ─── */}
        <section className="lg:col-span-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            {editingId ? "✏️ Modifier un licencié" : "➕ Ajouter un licencié"}
          </h2>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Prénom *</label>
                <input name="prenom" type="text" value={formData.prenom} onChange={handleChange} placeholder="Prénom"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Nom *</label>
                <input name="nom" type="text" value={formData.nom} onChange={handleChange} placeholder="Nom"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Date de naissance *</label>
                <input name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">N° licence *</label>
                <input name="licence" type="text" value={formData.licence} onChange={handleChange} placeholder="N° licence"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Poste</label>
                <input name="poste" type="text" value={formData.poste} onChange={handleChange} placeholder="Gardien..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Téléphone</label>
                <input name="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="06..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Statut</label>
              <select name="statut" value={formData.statut} onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                <option value="Actif">Actif</option>
                <option value="Blessé">Blessé</option>
                <option value="Repos">Repos</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 font-semibold rounded-lg py-2.5 transition text-xs md:text-sm">
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 font-semibold rounded-lg py-2.5 transition text-xs md:text-sm">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ─── LISTE ─── */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-semibold">Tous les licenciés</h2>
            {loading
              ? <span className="text-[11px] text-slate-400">Chargement...</span>
              : <span className="text-[11px] text-slate-500">{licencies.length} licencié{licencies.length > 1 ? "s" : ""}</span>
            }
          </div>

          {/* Mobile : cards */}
          <div className="lg:hidden space-y-3">
            {licencies.length === 0 && !loading && (
              <p className="text-center text-[11px] text-slate-500 py-4">Aucun licencié enregistré.</p>
            )}
            {licencies.map((lic) => (
              <div key={lic.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">{lic.prenom} {lic.nom}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUT_STYLE[lic.statut] || STATUT_STYLE.Actif}`}>
                    {lic.statut}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                  <p>Licence : <span className="text-slate-300">{lic.licence}</span></p>
                  {lic.poste    && <p>Poste : <span className="text-slate-300">{lic.poste}</span></p>}
                  {lic.telephone && <p>Tél : <span className="text-slate-300">{lic.telephone}</span></p>}
                  <p>Né(e) le : <span className="text-slate-300">{lic.dateNaissance}</span></p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => handleEdit(lic)}
                    className="flex-1 text-[11px] py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 transition text-center">
                    Modifier
                  </button>
                  <button type="button" onClick={() => handleDelete(lic.id)}
                    className="flex-1 text-[11px] py-1.5 rounded-lg border border-red-600 text-red-300 hover:bg-red-900/30 transition text-center">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop : tableau */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-3 font-medium">Prénom</th>
                  <th className="py-2 pr-3 font-medium">Nom</th>
                  <th className="py-2 pr-3 font-medium">Naissance</th>
                  <th className="py-2 pr-3 font-medium">Licence</th>
                  <th className="py-2 pr-3 font-medium">Poste</th>
                  <th className="py-2 pr-3 font-medium">Téléphone</th>
                  <th className="py-2 pr-3 font-medium">Statut</th>
                  <th className="py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {licencies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-[11px] text-slate-500">
                      Aucun licencié enregistré.
                    </td>
                  </tr>
                )}
                {licencies.map((lic) => (
                  <tr key={lic.id} className="border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/30 transition">
                    <td className="py-2.5 pr-3 whitespace-nowrap">{lic.prenom}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap font-medium">{lic.nom}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-slate-400">{lic.dateNaissance}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">{lic.licence}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{lic.poste || "–"}</td>
                    <td className="py-2.5 pr-3 text-slate-400">{lic.telephone || "–"}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUT_STYLE[lic.statut] || STATUT_STYLE.Actif}`}>
                        {lic.statut}
                      </span>
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button type="button" onClick={() => handleEdit(lic)}
                        className="text-[11px] px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 mr-1 transition">
                        Modifier
                      </button>
                      <button type="button" onClick={() => handleDelete(lic.id)}
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
