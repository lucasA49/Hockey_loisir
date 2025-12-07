import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Users, Trophy, CalendarDays } from "lucide-react";

// ✅ Base URL commune (vient du .env Vite)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

// ✅ Endpoint pour les événements
const API_URL = `${API_BASE_URL}/api/evenements`;

export default function AdminCalendrier() {
  const navBase =
    "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    dateEvent: "",
    heure: "",
    titre: "",
    statut: "Confirmé",
  });

  const sortByDateAsc = (a, b) => {
    const da = a.dateEvent || "";
    const db = b.dateEvent || "";
    if (da < db) return -1;
    if (da > db) return 1;
    const ha = a.heure || "";
    const hb = b.heure || "";
    if (ha < hb) return -1;
    if (ha > hb) return 1;
    return 0;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setEvents([]);
          return;
        }

        setEvents([...data].sort(sortByDateAsc));
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData({
      dateEvent: "",
      heure: "",
      titre: "",
      statut: "Confirmé",
    });
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.dateEvent || !formData.titre) {
      setError("Merci de saisir au minimum la date et le titre/match.");
      return;
    }

    const payload = {
      dateEvent: formData.dateEvent,
      heure: formData.heure || null,
      titre: formData.titre,
      statut: formData.statut || "Confirmé",
    };

    try {
      let res;
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
        setEvents((prev) =>
          prev
            .map((ev) => (ev.id === editingId ? data : ev))
            .sort(sortByDateAsc)
        );
        setMessage("Événement mis à jour.");
      } else {
        setEvents((prev) => [...prev, data].sort(sortByDateAsc));
        setMessage("Événement ajouté.");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
    }
  };

  const handleEdit = (ev) => {
    setEditingId(ev.id);
    setFormData({
      dateEvent: ev.dateEvent || "",
      heure: ev.heure || "",
      titre: ev.titre || "",
      statut: ev.statut || "Confirmé",
    });
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
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

      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setMessage("Événement supprimé.");
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
    }
  };

  const formatDate = (d) => {
    if (!d) return "Date à venir";
    try {
      const date = new Date(d);
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Calendrier</h1>

      {/* NAV ADMIN */}
      <nav className="w-full mb-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2">
          <p className="text-[11px] text-slate-500 px-1 mb-2">
            Navigation admin
          </p>

          <div className="grid grid-cols-4 gap-2 md:flex md:flex-row md:gap-3">
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
        Gestion des événements et matchs dans le calendrier.
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

      {/* GRID FORM + LISTE */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* FORMULAIRE */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            {editingId ? "Modifier un événement" : "Ajouter un événement"}
          </h2>

          <form className="space-y-3 text-xs md:text-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Date</label>
              <input
                type="date"
                name="dateEvent"
                value={formData.dateEvent}
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
              <label className="text-slate-400">Titre / Match</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Match vs Angers, entraînement, soirée DOGZ..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Statut</label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="Confirmé">Confirmé</option>
                <option value="À confirmer">À confirmer</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
              >
                {editingId ? "Mettre à jour" : "Ajouter l'événement"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTE ÉVÉNEMENTS */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">
              Événements à venir
            </h2>
            {loading && (
              <span className="text-[11px] text-slate-400">
                Chargement...
              </span>
            )}
          </div>

          <div className="bg-slate-900/60 rounded-xl divide-y divide-slate-800">
            {events.map((e) => (
              <div
                key={e.id}
                className="px-3 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs md:text-sm font-semibold">
                    {formatDate(e.dateEvent)}{" "}
                    {e.heure && (
                      <>
                        • <span className="text-slate-300">{e.heure}</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] md:text-xs text-slate-400">
                    {e.titre}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Statut : {e.statut}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(e)}
                    className="text-[11px] text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-800"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className="text-[11px] text-red-300 border border-red-500 rounded-full px-3 py-1 hover:bg-red-950/40"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}

            {!loading && events.length === 0 && (
              <div className="px-3 py-4 text-center text-[11px] text-slate-500">
                Aucun événement pour le moment.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
