import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_MATCHS     = `${API_BASE_URL}/api/matchs`;
const API_EVENEMENTS = `${API_BASE_URL}/api/evenements`;

const STATUT_STYLE = {
  Confirmé:      "bg-emerald-100 text-emerald-700",
  Joué:          "bg-emerald-100 text-emerald-700",
  "À venir":     "bg-amber-100  text-amber-700",
  "À confirmer": "bg-amber-100  text-amber-700",
  Annulé:        "bg-red-100    text-red-700",
};

const TYPE_STYLE = {
  match:     "bg-red-50   text-red-600  border-red-200",
  evenement: "bg-blue-50  text-blue-600 border-blue-200",
};

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    }).format(new Date(d + "T00:00:00"));
  } catch { return d; }
};

export default function Calendrier() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [resMatchs, resEvents] = await Promise.all([
          fetch(API_MATCHS),
          fetch(API_EVENEMENTS),
        ]);

        const matchsData  = await resMatchs.json();
        const eventsData  = await resEvents.json();

        const merged = [];

        // Matchs → on les affiche tous (À venir + Joué + Annulé)
        if (Array.isArray(matchsData)) {
          matchsData.forEach((m) => {
            if (!m.dateMatch) return;
            merged.push({
              id:      `match-${m.id}`,
              dateStr: m.dateMatch,
              heure:   m.heure || "",
              titre:   `DOGZ vs ${m.adversaire}`,
              lieu:    m.lieu || "",
              statut:  m.statut || "À venir",
              score:   (m.scoreDogz != null && m.scoreAdv != null) ? `${m.scoreDogz} – ${m.scoreAdv}` : null,
              type:    "match",
            });
          });
        }

        // Événements du calendrier (entraînements, sorties, etc.)
        if (Array.isArray(eventsData)) {
          eventsData.forEach((e) => {
            if (!e.dateEvent) return;
            merged.push({
              id:      `evt-${e.id}`,
              dateStr: e.dateEvent,
              heure:   e.heure || "",
              titre:   e.titre || "Événement",
              lieu:    "",
              statut:  e.statut || "Confirmé",
              score:   null,
              type:    "evenement",
            });
          });
        }

        // Trier : date ASC, puis heure ASC
        merged.sort((a, b) => {
          const cmp = a.dateStr.localeCompare(b.dateStr);
          if (cmp !== 0) return cmp;
          return (a.heure || "").localeCompare(b.heure || "");
        });

        setItems(merged);
      } catch {
        setError("Impossible de charger le calendrier.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Séparer à venir / passés
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = items.filter((i) => new Date(i.dateStr + "T00:00:00") >= today);
  const past     = items.filter((i) => new Date(i.dateStr + "T00:00:00") <  today);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-8 md:px-10 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-400 uppercase mb-2">
            DOGZ CHOLET HOCKEY LOISIR
          </p>
          <h1 className="text-3xl font-extrabold tracking-wide uppercase mb-2">
            Calendrier
          </h1>
          <p className="text-sm text-slate-400">
            Matchs et événements de l&apos;équipe DOGZ
          </p>
        </div>

        {error && <p className="text-center text-red-300 text-sm mb-4">{error}</p>}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-white/5 border border-slate-700 rounded-2xl px-6 py-8 text-center">
            <p className="text-slate-400 text-sm">
              Aucun match ni événement pour le moment.
            </p>
          </div>
        )}

        {/* ── À VENIR ── */}
        {!loading && upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">
              À venir
            </h2>
            <div className="bg-white text-slate-900 rounded-3xl shadow-lg overflow-hidden divide-y divide-slate-100">
              {upcoming.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* ── PASSÉS ── */}
        {!loading && past.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">
              Matchs passés
            </h2>
            <div className="bg-white/90 text-slate-700 rounded-3xl shadow overflow-hidden divide-y divide-slate-100 opacity-80">
              {[...past].reverse().map((item) => (
                <ItemRow key={item.id} item={item} past />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemRow({ item, past = false }) {
  return (
    <div className="px-4 py-4 flex items-start gap-3 sm:items-center sm:gap-4">
      {/* Badge type */}
      <div className={`shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border text-xs font-bold ${TYPE_STYLE[item.type] || TYPE_STYLE.evenement}`}>
        {item.type === "match" ? "⚡" : "📅"}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium mb-0.5 capitalize ${past ? "text-slate-400" : "text-slate-500"}`}>
          {formatDate(item.dateStr)}
          {item.heure && <span className="ml-2 font-bold text-red-600">{item.heure}</span>}
        </p>
        <p className={`font-bold text-sm sm:text-base truncate ${past ? "text-slate-500" : "text-slate-900"}`}>
          {item.titre}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {item.lieu && (
            <span className="text-[11px] text-slate-400">{item.lieu}</span>
          )}
          {item.score && (
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {item.score}
            </span>
          )}
        </div>
      </div>

      {/* Statut */}
      <span className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUT_STYLE[item.statut] || "bg-slate-100 text-slate-600"}`}>
        {item.statut}
      </span>
    </div>
  );
}
