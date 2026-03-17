import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/matchs`;

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
    }).format(new Date(d + "T00:00:00"));
  } catch { return d; }
};

const getResult = (scoreDogz, scoreAdv) => {
  if (scoreDogz == null || scoreAdv == null) return null;
  if (scoreDogz > scoreAdv) return "Victoire";
  if (scoreDogz < scoreAdv) return "Défaite";
  return "Nul";
};

const RESULT_STYLE = {
  Victoire: "bg-emerald-500/15 text-emerald-300",
  Défaite:  "bg-red-500/15 text-red-300",
  Nul:      "bg-slate-500/20 text-slate-300",
};

export default function Resultat() {
  const [matchs,  setMatchs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        setLoading(true);
        const res  = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) { setMatchs([]); return; }

        const joues = data
          .filter((m) => m.statut === "Joué")
          .sort((a, b) => {
            const cmp = (b.dateMatch || "").localeCompare(a.dateMatch || "");
            if (cmp !== 0) return cmp;
            return (b.heure || "").localeCompare(a.heure || "");
          });

        setMatchs(joues);
      } catch {
        setError("Impossible de charger les résultats pour le moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatchs();
  }, []);

  const lastMatch   = matchs.length > 0 ? matchs[0]       : null;
  const olderMatchs = matchs.length > 1 ? matchs.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-16 md:px-6">

        {/* En-tête */}
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-400 uppercase mb-2">
            DOGZ CHOLET HOCKEY LOISIR
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            Résultats des matchs
          </h1>
          <p className="text-sm text-slate-400">
            Retrouvez ici les derniers scores des DOGZ.
          </p>
        </header>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/70 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && matchs.length === 0 && (
          <div className="bg-white/5 border border-slate-800 rounded-2xl px-6 py-8 text-center">
            <p className="text-slate-400 text-sm">
              Aucun résultat enregistré pour le moment.
            </p>
          </div>
        )}

        {/* Dernier match mis en avant */}
        {lastMatch && (() => {
          const result = getResult(lastMatch.scoreDogz, lastMatch.scoreAdv);
          return (
            <section className="mb-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-6">
              <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mb-3">
                Dernier match joué
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Équipes + score */}
                <div>
                  <p className="text-xs text-slate-400 mb-1 capitalize">
                    {formatDate(lastMatch.dateMatch)}
                    {lastMatch.heure && <span className="ml-2 font-bold text-red-500">{lastMatch.heure}</span>}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-300 mb-1">DOGZ</p>
                      <p className="text-4xl font-black text-red-400">{lastMatch.scoreDogz ?? "-"}</p>
                    </div>
                    <p className="text-xl font-bold text-slate-600 mt-4">–</p>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-300 mb-1">{lastMatch.adversaire}</p>
                      <p className="text-4xl font-black text-slate-200">{lastMatch.scoreAdv ?? "-"}</p>
                    </div>
                  </div>
                  {lastMatch.lieu && (
                    <p className="text-xs text-slate-500 mt-2">{lastMatch.lieu}</p>
                  )}
                </div>

                {/* Résultat badge */}
                {result && (
                  <span className={`self-start sm:self-center inline-block px-4 py-2 rounded-full text-sm font-bold ${RESULT_STYLE[result]}`}>
                    {result}
                  </span>
                )}
              </div>
            </section>
          );
        })()}

        {/* Historique */}
        {olderMatchs.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-4">
              Historique des résultats
            </h2>

            {/* Mobile : cards */}
            <div className="md:hidden space-y-3">
              {olderMatchs.map((m) => {
                const result = getResult(m.scoreDogz, m.scoreAdv);
                return (
                  <div key={m.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400 capitalize">{formatDate(m.dateMatch)}</p>
                      {result && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RESULT_STYLE[result]}`}>
                          {result}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">
                        DOGZ <span className="text-slate-400 font-normal">vs</span> {m.adversaire}
                      </p>
                      {m.scoreDogz != null && m.scoreAdv != null && (
                        <span className="text-sm font-bold text-red-400">
                          {m.scoreDogz} – {m.scoreAdv}
                        </span>
                      )}
                    </div>
                    {m.lieu && (
                      <p className="text-[11px] text-slate-500 mt-1">{m.lieu}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop : tableau */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-800">
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Match</th>
                    <th className="pb-3 pr-4 font-medium">Score</th>
                    <th className="pb-3 pr-4 font-medium">Lieu</th>
                    <th className="pb-3 font-medium">Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {olderMatchs.map((m) => {
                    const result = getResult(m.scoreDogz, m.scoreAdv);
                    return (
                      <tr key={m.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition">
                        <td className="py-3 pr-4 whitespace-nowrap text-slate-300 capitalize">
                          {formatDate(m.dateMatch)}
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          <span className="font-bold">DOGZ</span> vs {m.adversaire}
                        </td>
                        <td className="py-3 pr-4 font-bold text-red-400 whitespace-nowrap">
                          {m.scoreDogz == null || m.scoreAdv == null ? "–" : `${m.scoreDogz} – ${m.scoreAdv}`}
                        </td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                          {m.lieu || "–"}
                        </td>
                        <td className="py-3">
                          {result && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${RESULT_STYLE[result]}`}>
                              {result}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
