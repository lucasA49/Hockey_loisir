import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Trash2, Save, ExternalLink } from "lucide-react";
import AdminNav from "./AdminNav";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_MATCHS = `${API_BASE_URL}/api/matchs`;
const API_LICENCIES = `${API_BASE_URL}/api/licencies`;

// Doit rester aligné avec server/controllers/compositionController.js
const MAX_LIGNES = 6;
const MAX_JOUEURS_PAR_LIGNE = 5;

const CATEGORIES = [
  { cle: "attaque",  titre: "Attaque",  libelle: "Ligne",   placeholder: "Prénom de l'attaquant" },
  { cle: "defense",  titre: "Défense",  libelle: "Ligne",   placeholder: "Prénom du défenseur" },
  { cle: "gardiens", titre: "Gardiens", libelle: "Gardien", placeholder: "Prénom du gardien" },
];

const STATUT_STYLE = {
  Joué:      "bg-emerald-500/15 text-emerald-300",
  Annulé:    "bg-red-500/15 text-red-300",
  "À venir": "bg-amber-500/15 text-amber-300",
};

const emptyComposition = () => ({ attaque: [[]], defense: [[]], gardiens: [[]] });

// Ajoute une ligne vide aux catégories sans ligne, pour pouvoir saisir directement
const withEmptyLines = (compo) => {
  const result = {};
  CATEGORIES.forEach(({ cle }) => {
    result[cle] = compo[cle]?.length ? compo[cle] : [[]];
  });
  return result;
};

const formatDate = (d) => {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d + "T00:00:00"));
  } catch { return d; }
};

export default function AdminCompositions() {
  const [matchs, setMatchs] = useState([]);
  const [prenomsConnus, setPrenomsConnus] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [composition, setComposition] = useState(emptyComposition);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(emptyComposition()));
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCompo, setLoadingCompo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isDirty = JSON.stringify(composition) !== savedSnapshot;
  const selectedMatch = matchs.find((m) => m.id === selectedId);

  // ── Chargement initial : matchs + prénoms des licenciés (autocomplétion) ──
  useEffect(() => {
    Promise.all([fetch(API_MATCHS), fetch(API_LICENCIES)])
      .then(async ([rm, rl]) => {
        const dm = await rm.json();
        const dl = rl.ok ? await rl.json() : [];
        setMatchs(Array.isArray(dm) ? dm : []);
        if (Array.isArray(dl)) {
          // Prénoms uniques (insensible à la casse), avec majuscule initiale
          const parCle = new Map();
          dl.forEach(({ prenom }) => {
            const p = (prenom || "").trim();
            if (p) parCle.set(p.toLowerCase(), p.charAt(0).toUpperCase() + p.slice(1));
          });
          setPrenomsConnus([...parCle.values()].sort((a, b) => a.localeCompare(b, "fr")));
        }
      })
      .catch(() => setError("Impossible de charger les matchs."))
      .finally(() => setLoading(false));
  }, []);

  // ── Chargement de la composition du match sélectionné ──
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setLoadingCompo(true);
    setError(""); setMessage("");

    fetch(`${API_MATCHS}/${selectedId}/composition`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const compo = withEmptyLines(data);
        setComposition(compo);
        setSavedSnapshot(JSON.stringify(compo));
        setHasSaved(Array.isArray(data.joueurs) && data.joueurs.length > 0);
      })
      .catch(() => !cancelled && setError("Impossible de charger la composition."))
      .finally(() => !cancelled && setLoadingCompo(false));

    return () => { cancelled = true; };
  }, [selectedId]);

  const selectMatch = (id) => {
    if (id === selectedId) return;
    if (isDirty && !window.confirm("Des modifications ne sont pas enregistrées. Changer de match quand même ?")) return;
    setSelectedId(id);
  };

  // ── Édition ──
  const updateCategorie = (cle, fn) =>
    setComposition((c) => ({ ...c, [cle]: fn(c[cle]) }));

  const addLigne = (cle) =>
    updateCategorie(cle, (lignes) => (lignes.length >= MAX_LIGNES ? lignes : [...lignes, []]));

  const removeLigne = (cle, index) =>
    updateCategorie(cle, (lignes) => lignes.filter((_, i) => i !== index));

  const addJoueur = (cle, index, prenom) =>
    updateCategorie(cle, (lignes) =>
      lignes.map((l, i) => (i === index ? [...l, prenom] : l))
    );

  const removeJoueur = (cle, index, k) =>
    updateCategorie(cle, (lignes) =>
      lignes.map((l, i) => (i === index ? l.filter((_, j) => j !== k) : l))
    );

  // ── Enregistrer (PUT) ──
  const handleSave = async () => {
    setError(""); setMessage(""); setSaving(true);
    try {
      const res = await authFetch(`${API_MATCHS}/${selectedId}/composition`, {
        method: "PUT",
        body: JSON.stringify(composition),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur lors de l'enregistrement."); return; }

      const compo = withEmptyLines(data);
      setComposition(compo);
      setSavedSnapshot(JSON.stringify(compo));
      setHasSaved(data.joueurs.length > 0);
      setMessage("Composition enregistrée.");
    } catch {
      setError("Erreur de communication avec le serveur.");
    } finally {
      setSaving(false);
    }
  };

  // ── Supprimer (DELETE) ──
  const handleDelete = async () => {
    if (!window.confirm("Supprimer toute la composition de ce match ?")) return;
    setError(""); setMessage("");
    try {
      const res = await authFetch(`${API_MATCHS}/${selectedId}/composition`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) { setError("Erreur lors de la suppression."); return; }
      const compo = emptyComposition();
      setComposition(compo);
      setSavedSnapshot(JSON.stringify(compo));
      setHasSaved(false);
      setMessage("Composition supprimée.");
    } catch {
      setError("Erreur de communication avec le serveur.");
    }
  };

  const totalJoueurs = useMemo(
    () => new Set(CATEGORIES.flatMap(({ cle }) => composition[cle].flat())).size,
    [composition]
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Admin – Compositions</h1>
      <AdminNav />
      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Choisissez un match puis renseignez les joueurs DOGZ ligne par ligne. Ils apparaissent sur la page du match.
      </p>

      {error   && <div className="mb-3 text-xs text-red-300 bg-red-950/40 border border-red-700/60 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="mb-3 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-2">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">

        {/* ─── LISTE DES MATCHS ─── */}
        <section className="lg:col-span-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">Matchs</h2>
          {loading && <p className="text-[11px] text-slate-400">Chargement...</p>}
          {!loading && matchs.length === 0 && (
            <p className="text-[11px] text-slate-500 py-4 text-center">Aucun match. Créez-en un dans « Résultats ».</p>
          )}
          <div className="space-y-2 max-h-72 lg:max-h-[70vh] overflow-y-auto pr-1">
            {matchs.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMatch(m.id)}
                className={`w-full text-left rounded-xl border px-3 py-2.5 transition ${
                  m.id === selectedId
                    ? "bg-red-600/20 border-red-500"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">{formatDate(m.dateMatch)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUT_STYLE[m.statut] || "bg-slate-700 text-slate-300"}`}>
                    {m.statut}
                  </span>
                </div>
                <p className="text-sm font-semibold truncate">DOGZ vs {m.adversaire}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ─── ÉDITEUR ─── */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          {!selectedMatch ? (
            <p className="text-sm text-slate-400 text-center py-12">← Sélectionnez un match pour éditer sa composition.</p>
          ) : loadingCompo ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="bg-slate-800/50 rounded-xl h-20 animate-pulse" />)}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-sm md:text-base font-semibold">DOGZ vs {selectedMatch.adversaire}</h2>
                  <p className="text-[11px] text-slate-400">
                    {formatDate(selectedMatch.dateMatch)} · {totalJoueurs} joueur{totalJoueurs > 1 ? "s" : ""}
                    {isDirty && <span className="ml-2 text-amber-300">● non enregistré</span>}
                  </p>
                </div>
                <Link
                  to={`/match/${selectedMatch.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Page publique
                </Link>
              </div>

              <div className="space-y-6">
                {CATEGORIES.map(({ cle, titre, libelle, placeholder }) => (
                  <div key={cle}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[11px] font-bold tracking-widest text-red-400 uppercase">{titre}</h3>
                      <button
                        type="button"
                        onClick={() => addLigne(cle)}
                        disabled={composition[cle].length >= MAX_LIGNES}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" /> {cle === "gardiens" ? "Ajouter un gardien" : "Ajouter une ligne"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {composition[cle].map((ligne, i) => (
                        <LigneEditor
                          key={i}
                          label={`${libelle} ${i + 1}`}
                          joueurs={ligne}
                          placeholder={placeholder}
                          suggestions={prenomsConnus}
                          maxJoueurs={cle === "gardiens" ? 1 : MAX_JOUEURS_PAR_LIGNE}
                          onAdd={(p) => addJoueur(cle, i, p)}
                          onRemove={(k) => removeJoueur(cle, i, k)}
                          onRemoveLigne={() => removeLigne(cle, i)}
                        />
                      ))}
                      {composition[cle].length === 0 && (
                        <p className="text-[11px] text-slate-500">Aucune ligne.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 font-semibold rounded-lg py-2.5 transition text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer la composition"}
                </button>
                {hasSaved && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-600 text-red-300 hover:bg-red-900/30 transition text-xs md:text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function LigneEditor({ label, joueurs, placeholder, suggestions, maxJoueurs, onAdd, onRemove, onRemoveLigne }) {
  const [value, setValue] = useState("");
  const [warning, setWarning] = useState("");
  const isFull = joueurs.length >= maxJoueurs;

  // Suggestions issues des licenciés, hors joueurs déjà dans la ligne
  const recherche = value.trim().toLowerCase();
  const suggestionsFiltrees = recherche
    ? suggestions
        .filter((p) => p.toLowerCase().startsWith(recherche))
        .filter((p) => !joueurs.some((j) => j.toLowerCase() === p.toLowerCase()))
        .slice(0, 5)
    : [];

  const submit = (prenomChoisi = value) => {
    const prenom = prenomChoisi.trim();
    if (!prenom) return;
    if (joueurs.some((j) => j.toLowerCase() === prenom.toLowerCase())) {
      setWarning(`${prenom} est déjà dans cette ligne.`);
      return;
    }
    onAdd(prenom);
    setValue("");
    setWarning("");
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-300">{label}</span>
        <button
          type="button"
          onClick={onRemoveLigne}
          aria-label={`Supprimer ${label}`}
          className="text-slate-500 hover:text-red-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {joueurs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {joueurs.map((j, k) => (
            <span key={`${j}-${k}`} className="inline-flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 rounded-full pl-2.5 pr-1 py-0.5">
              {j}
              <button type="button" onClick={() => onRemove(k)} aria-label={`Retirer ${j}`} className="text-slate-400 hover:text-red-400 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {!isFull && (
        <div className="flex gap-2">
          <input
            type="text"
            autoComplete="off"
            value={value}
            maxLength={40}
            placeholder={placeholder}
            onChange={(e) => { setValue(e.target.value); setWarning(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
            className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={() => submit()}
            aria-label="Ajouter le joueur"
            className="shrink-0 inline-flex items-center justify-center w-9 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      {!isFull && suggestionsFiltrees.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestionsFiltrees.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => submit(p)}
              className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-slate-600 text-slate-300 hover:border-red-500 hover:text-white transition"
            >
              + {p}
            </button>
          ))}
        </div>
      )}
      {warning && <p className="text-[11px] text-amber-300 mt-1">{warning}</p>}
    </div>
  );
}
