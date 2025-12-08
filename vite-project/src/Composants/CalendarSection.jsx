// src/components/MatchCalendar.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/evenements`;

export default function MatchCalendar() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date à venir";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const sortByDateAsc = (a, b) => {
    const da = a.dateMatch || "";
    const db = b.dateMatch || "";
    if (da < db) return -1;
    if (da > db) return 1;

    const ha = a.heure || "";
    const hb = b.heure || "";
    if (ha < hb) return -1;
    if (ha > hb) return 1;
    return 0;
  };

  const getBadgeClasses = (statut) => {
    switch (statut) {
      case "Joué":
      case "Confirmé":
        return "bg-emerald-100 text-emerald-700";
      case "Annulé":
        return "bg-red-100 text-red-700";
      case "À confirmer":
      case "À venir":
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setMatches([]);
          return;
        }

        const sorted = [...data].sort(sortByDateAsc);
        setMatches(sorted);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le calendrier des matchs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchs();
  }, []);

  return (
    <section className="px-4 py-8 mx-auto max-w-md md:max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white text-center mb-6 uppercase">
        Calendrier des matchs
      </h2>

      {loading && (
        <p className="text-center text-xs text-slate-300 mb-3">
          Chargement du calendrier...
        </p>
      )}

      {error && (
        <p className="text-center text-xs text-red-300 mb-3">{error}</p>
      )}

      {!loading && !error && matches.length === 0 && (
        <p className="text-center text-xs text-slate-300 mb-3">
          Aucun match enregistré pour le moment.
        </p>
      )}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden md:p-4">
        {matches.map((m, index) => (
          <div
            key={m.id}
            className={`px-4 md:px-6 py-3 flex items-center justify-between ${
              index !== matches.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-semibold text-slate-900">
                {formatDate(m.dateMatch)}{" "}
                {m.heure && (
                  <>
                    • <span className="text-slate-700">{m.heure}</span>
                  </>
                )}
              </span>
              <span className="text-xs md:text-sm text-slate-600">
                Match vs {m.adversaire || "À définir"}
              </span>
              <span className="text-xs md:text-sm text-slate-500">
                {m.lieu || "Lieu à définir"}
              </span>
            </div>

            <span
              className={`text-[11px] md:text-xs font-semibold px-3 py-1 rounded-full ${getBadgeClasses(
                m.statut
              )}`}
            >
              {m.statut || "À venir"}
            </span>
          </div>
        ))}

        <div className="border-t border-slate-100 px-4 md:px-6 py-3 text-center">
          <NavLink
            to="/calendrier"
            className="inline-block w-full text-xs md:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full px-4 py-2 transition text-center"
          >
            Voir tous les matchs →
          </NavLink>
        </div>
      </div>
    </section>
  );
}
