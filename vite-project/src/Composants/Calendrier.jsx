import { useState, useEffect } from "react";

export default function Calendrier() {
  // Base URL depuis .env
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${API_BASE_URL}/api/evenements`;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Charger les événements au chargement
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setEvents([]);
        } else {
          // Trier par date
          const sorted = [...data].sort((a, b) =>
            a.date_evenement.localeCompare(b.date_evenement)
          );
          setEvents(sorted);
        }
      } catch (err) {
        console.error("Erreur fetch événements:", err);
        setError("Impossible de charger les matchs.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 md:px-10 md:py-10">
      {/* Titre */}
      <h1 className="text-3xl font-extrabold tracking-wide text-center uppercase mb-6">
        Calendrier des Matchs
      </h1>

      <p className="text-center text-sm text-slate-400 mb-8">
        Prochains matchs programmés pour l’équipe DOGZ
      </p>

      {error && (
        <p className="text-center text-red-300 text-sm mb-4">{error}</p>
      )}

      {loading && (
        <p className="text-center text-slate-400 text-sm mb-4">
          Chargement des matchs...
        </p>
      )}

      <section className="max-w-3xl mx-auto">
        <div className="bg-white text-slate-900 rounded-3xl shadow-lg overflow-hidden">
          {/* Si aucun événement */}
          {!loading && events.length === 0 && (
            <div className="px-4 py-4 text-center text-sm text-slate-500">
              Aucun match enregistré pour le moment.
            </div>
          )}

          {/* Liste dynamique */}
          {events.map((e, index) => (
            <div
              key={e.id}
              className={`px-4 py-4 flex items-center justify-between ${
                index !== events.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              {/* Partie gauche */}
              <div>
                <p className="text-sm font-semibold">
                  {e.date_evenement}{" "}
                  {e.heure_evenement ? `• ${e.heure_evenement}` : ""}
                </p>

                <p className="text-xs text-slate-600">
                  {e.titre || "Match / événement"}
                </p>

                <p className="text-xs text-slate-500">{e.lieu || "Lieu à définir"}</p>
              </div>

              {/* Badge statut */}
              <span
                className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                  e.statut === "Confirmé"
                    ? "bg-emerald-100 text-emerald-700"
                    : e.statut === "Annulé"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {e.statut || "Prévu"}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button className="text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition">
            Charger plus de matchs
          </button>
        </div>
      </section>
    </div>
  );
}
