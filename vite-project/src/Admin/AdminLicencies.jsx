import { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/licencies`;

export default function AdminLicencies() {
  const [licencies, setLicencies] = useState([]);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    licence: "",
    poste: "",
    telephone: "",
    statut: "Actif",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLicencies = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
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
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.prenom || !formData.nom || !formData.dateNaissance || !formData.licence) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    try {
      const payload = {
        prenom: formData.prenom,
        nom: formData.nom,
        dateNaissance: formData.dateNaissance,
        licence: formData.licence,
        poste: formData.poste || null,
        telephone: formData.telephone || null,
        statut: formData.statut || "Actif",
      };

      let res;
      if (editingId) {
        res = await authFetch(`${API_URL}/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        res = await authFetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erreur lors de l'enregistrement.");
        return;
      }

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

  const handleEdit = (licencie) => {
    setEditingId(licencie.id);
    setFormData({
      prenom: licencie.prenom || "",
      nom: licencie.nom || "",
      dateNaissance: licencie.dateNaissance || "",
      licence: licencie.licence || "",
      poste: licencie.poste || "",
      telephone: licencie.telephone || "",
      statut: licencie.statut || "Actif",
    });
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce licencié ?")) return;
    setError("");
    setMessage("");

    try {
      const res = await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        setError("Erreur lors de la suppression.");
        return;
      }
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
        {/* FORMULAIRE AJOUT / MODIF */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            {editingId ? "Modifier un licencié" : "Ajouter un licencié"}
          </h2>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="prenom">Prénom</label>
              <input id="prenom" name="prenom" type="text" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="nom">Nom</label>
              <input id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange} placeholder="Nom" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="dateNaissance">Date de naissance</label>
              <input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="licence">N° de licence</label>
              <input id="licence" name="licence" type="text" value={formData.licence} onChange={handleChange} placeholder="Numéro de licence" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="poste">Poste</label>
              <input id="poste" name="poste" type="text" value={formData.poste} onChange={handleChange} placeholder="Gardien, Défenseur, Attaquant..." className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="telephone">Téléphone</label>
              <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="06..." className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400" htmlFor="statut">Statut</label>
              <select id="statut" name="statut" value={formData.statut} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                <option value="Actif">Actif</option>
                <option value="Blessé">Blessé</option>
                <option value="Repos">Repos</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-xs md:text-sm font-semibold rounded-lg py-2 transition">
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="flex-1 bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTE DES LICENCIÉS */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">Liste des licenciés</h2>
            {loading && <span className="text-[11px] text-slate-400">Chargement...</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-4">Prénom</th>
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">Date de naissance</th>
                  <th className="py-2 pr-4">N° licence</th>
                  <th className="py-2 pr-4">Poste</th>
                  <th className="py-2 pr-4">Téléphone</th>
                  <th className="py-2 pr-4">Statut</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {licencies.map((lic) => (
                  <tr key={lic.id} className="border-b border-slate-800/60 last:border-b-0">
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.prenom}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.nom}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.dateNaissance}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.licence}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.poste || "-"}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lic.telephone || "-"}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                        lic.statut === "Actif" ? "bg-emerald-500/15 text-emerald-300"
                        : lic.statut === "Blessé" ? "bg-red-500/15 text-red-300"
                        : "bg-amber-500/15 text-amber-300"
                      }`}>
                        {lic.statut || "Actif"}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleEdit(lic)} className="text-[11px] px-3 py-1 rounded-full border border-slate-600 hover:bg-slate-800">
                          Modifier
                        </button>
                        <button type="button" onClick={() => handleDelete(lic.id)} className="text-[11px] px-3 py-1 rounded-full border border-red-500 text-red-300 hover:bg-red-950/40">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {licencies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-[11px] text-slate-500">
                      Aucun licencié pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
