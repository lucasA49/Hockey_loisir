import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, Users, ListOrdered, ArrowLeft, MapPin, Clock } from "lucide-react";
import Header from "../Composants/Header";
import Footer from "../Composants/Footer";
import NiveauBadge from "../Composants/NiveauBadge";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_MATCHS = `${API_BASE_URL}/api/matchs`;

const STATUT_STYLE = {
  Joué:      "bg-emerald-100 text-emerald-700",
  "À venir": "bg-amber-100 text-amber-700",
  Annulé:    "bg-red-100 text-red-700",
};

const CATEGORIES = [
  { cle: "attaque",  titre: "Attaque",  libelle: "Ligne" },
  { cle: "defense",  titre: "Défense",  libelle: "Ligne" },
  { cle: "gardiens", titre: "Gardiens", libelle: "Gardien" },
];

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    }).format(new Date(d + "T00:00:00"));
  } catch { return d; }
};

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [composition, setComposition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [resMatch, resCompo] = await Promise.all([
          fetch(`${API_MATCHS}/${id}`),
          fetch(`${API_MATCHS}/${id}/composition`),
        ]);
        if (!resMatch.ok) {
          setError(resMatch.status === 404 ? "Ce match n'existe pas." : "Impossible de charger le match.");
          return;
        }
        setMatch(await resMatch.json());
        if (resCompo.ok) setComposition(await resCompo.json());
      } catch {
        setError("Impossible de charger le match.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const hasScore = match && match.scoreDogz != null && match.scoreAdv != null;
  const joueurs = composition?.joueurs || [];
  const hasLignes = composition && CATEGORIES.some((c) => composition[c.cle]?.length > 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 text-white px-4 py-8 md:px-10 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/calendrier" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Retour au calendrier
          </Link>

          {loading && <div className="bg-slate-800/50 rounded-3xl h-48 animate-pulse" />}
          {error && <p className="text-center text-red-300 text-sm">{error}</p>}

          {!loading && match && (
            <>
              {/* ── Carte du match ── */}
              <div className="bg-white text-slate-900 rounded-3xl shadow-lg p-6 mb-6 text-center">
                <p className="text-xs font-medium text-slate-500 capitalize mb-4">{formatDate(match.dateMatch)}</p>

                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
                  <p className="flex-1 text-right text-lg sm:text-2xl font-extrabold uppercase">DOGZ</p>
                  {hasScore ? (
                    <p className="text-3xl sm:text-4xl font-black text-red-600 whitespace-nowrap">
                      {match.scoreDogz} – {match.scoreAdv}
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-slate-400">VS</p>
                  )}
                  <p className="flex-1 text-left text-lg sm:text-2xl font-extrabold uppercase truncate">{match.adversaire}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
                  {match.heure && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{match.heure}</span>}
                  {match.lieu && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{match.lieu}</span>}
                  <NiveauBadge niveau={match.niveau} size="lg" />
                  <span className={`font-semibold px-3 py-1 rounded-full ${STATUT_STYLE[match.statut] || "bg-slate-100 text-slate-600"}`}>
                    {match.statut}
                  </span>
                </div>
              </div>

              {/* ── Joueurs ── */}
              <Accordeon icon={<Users className="w-4 h-4 text-red-400" />} titre={`Joueurs DOGZ (${joueurs.length})`} defaultOpen>
                {joueurs.length === 0 ? (
                  <p className="text-sm text-slate-400">La feuille de match n&apos;est pas encore renseignée.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {joueurs.map((j) => (
                      <span key={j} className="text-sm font-medium bg-slate-800 border border-slate-700 rounded-full px-3 py-1">{j}</span>
                    ))}
                  </div>
                )}
              </Accordeon>

              {/* ── Lignes ── */}
              <Accordeon icon={<ListOrdered className="w-4 h-4 text-red-400" />} titre="Lignes">
                {!hasLignes ? (
                  <p className="text-sm text-slate-400">Les lignes n&apos;ont pas encore été renseignées.</p>
                ) : (
                  <div className="space-y-5">
                    {CATEGORIES.map(({ cle, titre, libelle }) =>
                      composition[cle]?.length > 0 && (
                        <div key={cle}>
                          <h3 className="text-[11px] font-bold tracking-widest text-red-400 uppercase mb-2">{titre}</h3>
                          <div className="space-y-2">
                            {composition[cle].map((ligne, i) => (
                              <div key={i} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
                                <span className="shrink-0 text-xs font-bold text-slate-400 w-16 pt-1">{libelle} {i + 1}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {ligne.map((p, k) => (
                                    <span key={k} className="text-sm bg-slate-900 rounded-full px-2.5 py-0.5">{p}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </Accordeon>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function Accordeon({ icon, titre, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/40 transition"
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          {icon} {titre}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}
