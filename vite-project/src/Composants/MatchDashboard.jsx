import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const API_MATCHS = "http://localhost:4000/api/matchs";
const API_EVENTS = "http://localhost:4000/api/evenements";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
};

const formatDateWithWeekday = (dateStr) => {
  if (!dateStr) return "";
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

export default function MatchDashboard() {
  const [nextEvent, setNextEvent] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resMatchs, resEvents] = await Promise.all([
          fetch(API_MATCHS),
          fetch(API_EVENTS),
        ]);

        const matchsData = await resMatchs.json();
        const eventsData = await resEvents.json();

        const now = new Date();

        // === PROCHAIN MATCH depuis les EVENEMENTS ===
        if (Array.isArray(eventsData)) {
          const upcoming = eventsData
            .filter((e) => {
              if (!e.dateEvent) return false;
              if (e.statut === "Annulé") return false;

              const dateTime = new Date(
                e.dateEvent + "T" + (e.heure || "00:00")
              );
              return dateTime >= now;
            })
            .map((e) => ({
              ...e,
              dateObj: new Date(e.dateEvent + "T" + (e.heure || "00:00")),
            }))
            .sort((a, b) => a.dateObj - b.dateObj);

          setNextEvent(upcoming[0] || null);
        } else {
          setNextEvent(null);
        }

        // === DERNIERS RÉSULTATS depuis les MATCHS ===
        if (Array.isArray(matchsData)) {
          const played = matchsData
            .filter(
              (m) =>
                m.statut === "Joué" &&
                m.scoreDogz != null &&
                m.scoreAdv != null
            )
            .sort((a, b) => {
              const da = a.dateMatch || "";
              const db = b.dateMatch || "";
              if (da < db) return 1;
              if (da > db) return -1;
              return 0;
            })
            .slice(0, 2);

          setRecentResults(played);
        } else {
          setRecentResults([]);
        }
      } catch (err) {
        console.error("Erreur fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 relative z-10">
      <div className="-mt-24 bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-10 border border-gray-100">
        {/* --- PARTIE 1 : PROCHAIN MATCH (depuis evenements) --- */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Prochain match
          </h3>

          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-6 animate-pulse h-40" />
          ) : nextEvent ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              {/* Infos */}
              <div className="text-left md:w-1/3">
                <div className="text-xl font-bold text-gray-900">
                  {formatDateWithWeekday(nextEvent.dateEvent)}
                </div>
                {nextEvent.heure && (
                  <div className="text-red-600 font-bold">
                    {nextEvent.heure}
                  </div>
                )}
                <div className="text-gray-500 mt-1">
                  Patinoire de Cholet
                </div>
              </div>

              {/* Duel visuel (DOGZ vs ADV générique) */}
              <div className="flex items-center gap-6 md:w-1/3 justify-center">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center border-4 border-red-600 shadow-md">
                  <span className="text-white font-bold">DOGZ</span>
                </div>
                <span className="text-2xl font-black text-gray-400 italic">
                  VS
                </span>
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-400">
                  <span className="text-gray-600 text-[10px] font-bold text-center">
                    ADV
                  </span>
                </div>
              </div>

              {/* Tag / type d'événement */}
              <div className="text-right md:w-1/3 hidden md:block">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                  {nextEvent.statut || "Amical / Loisir"}
                </span>
                {nextEvent.titre && (
                  <p className="mt-2 text-xs text-gray-500">
                    {nextEvent.titre}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">
                Aucun match à venir pour le moment. Dès que tu ajoutes un
                événement dans l&apos;admin (Calendrier) avec une date
                future et un statut différent de &quot;Annulé&quot;, il
                s&apos;affichera ici.
              </p>
            </div>
          )}

          <NavLink
            to="/calendrier"
            className="inline-block mt-6 w-full md:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3 px-12 rounded-lg transition text-center"
          >
            Voir les détails
          </NavLink>
        </div>

        <hr className="border-gray-200 my-8" />

        {/* --- PARTIE 2 : RÉSULTATS RÉCENTS (depuis matchs) --- */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
            Résultats récents
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-normal">Date</th>
                  <th className="pb-3 font-normal">Match</th>
                  <th className="pb-3 font-normal text-right">Score</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      Chargement...
                    </td>
                  </tr>
                ) : recentResults.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      Aucun match joué pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentResults.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 font-medium">
                        {formatDate(m.dateMatch)}
                      </td>
                      <td className="py-4">
                        <span className="font-bold">DOGZ</span> vs{" "}
                        {m.adversaire || "Adversaire"}
                      </td>
                      <td className="py-4 text-right font-bold text-green-600">
                        {m.scoreDogz} — {m.scoreAdv}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <NavLink
              to="/resultats"
              className="text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wide transition-colors"
            >
              Voir tous les résultats →
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
