import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/matchs";

export default function Resultat() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les matchs depuis le backend
  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setMatchs([]);
          return;
        }

        // On garde seulement les matchs joués
        const joues = data.filter((m) => m.statut === "Joué");

        // Tri du plus récent au plus ancien (date + heure si dispo)
        joues.sort((a, b) => {
          const da = a.dateMatch || "";
          const db = b.dateMatch || "";
          if (da < db) return 1;
          if (da > db) return -1;

          const ha = a.heure || "";
          const hb = b.heure || "";
          if (ha < hb) return 1;
          if (ha > hb) return -1;
          return 0;
        });

        setMatchs(joues);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les résultats pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchs();
  }, []);

  const lastMatch = matchs.length > 0 ? matchs[0] : null;
  const olderMatchs = matchs.length > 1 ? matchs.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Contenu principal */}
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-16 md:px-6 lg:px-0">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-400 uppercase mb-2">
            DOGZ CHOLET HOCKEY LOISIR
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            Résultats des matchs
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Retrouvez ici les derniers scores des DOGZ.  
            La page se mettra à jour au fur et à mesure des matchs joués.
          </p>
        </header>

        {/* États : chargement / erreur / aucun match */}
        {loading && (
          <p className="text-sm text-slate-400 mb-6">Chargement des résultats...</p>
        )}

        {error && (
          <div className="mb-6 text-sm text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && matchs.length === 0 && (
          <p className="text-sm text-slate-400 mb-6">
            Aucun match joué enregistré pour le moment.  
            Les résultats apparaîtront ici dès que des matchs seront saisis dans le panel admin.
          </p>
        )}

        {/* Dernier match joué mis en avant */}
        {lastMatch && (
          <section className="mb-10 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Dernier match joué
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  {lastMatch.dateMatch || "Date à venir"}{" "}
                  {lastMatch.heure && `• ${lastMatch.heure}`}
                </p>
                <p className="text-lg md:text-xl font-bold mb-1">
                  DOGZ CHOLET{" "}
                  <span className="text-red-400">
                    {lastMatch.scoreDogz ?? "-"}
                  </span>{" "}
                  –{" "}
                  <span className="text-slate-200">
                    {lastMatch.scoreAdv ?? "-"}
                  </span>{" "}
                  {lastMatch.adversaire}
                </p>
                {lastMatch.lieu && (
                  <p className="text-xs text-slate-400">
                    Lieu : {lastMatch.lieu}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300`}
                >
                  Match joué
                </span>
                <p className="text-[11px] text-slate-400">
                  Saisi via le panel administrateur.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Historique des autres matchs */}
        {olderMatchs.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Historique des résultats
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-800">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Adversaire</th>
                    <th className="py-2 pr-4">Lieu</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {olderMatchs.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-slate-800/60 last:border-b-0"
                    >
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {m.dateMatch || "-"}{" "}
                        {m.heure && (
                          <span className="text-[11px] text-slate-500">
                            • {m.heure}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {m.adversaire}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {m.lieu || "-"}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {m.scoreDogz == null || m.scoreAdv == null
                          ? "-"
                          : `${m.scoreDogz} - ${m.scoreAdv}`}
                      </td>
                      <td className="py-2">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
