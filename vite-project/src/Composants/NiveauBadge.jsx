import { NIVEAUX } from "../utils/niveaux";

const STYLES = {
  light: {
    Débutant:      "bg-sky-100 text-sky-700",
    Intermédiaire: "bg-violet-100 text-violet-700",
    Confirmé:      "bg-fuchsia-100 text-fuchsia-700",
  },
  dark: {
    Débutant:      "bg-sky-500/15 text-sky-300",
    Intermédiaire: "bg-violet-500/15 text-violet-300",
    Confirmé:      "bg-fuchsia-500/15 text-fuchsia-300",
  },
};

// Badge du niveau d'un match, avec 1 à 3 barres selon la difficulté
export default function NiveauBadge({ niveau, theme = "light", size = "sm", className = "" }) {
  if (!NIVEAUX.includes(niveau)) return null;
  const rang = NIVEAUX.indexOf(niveau) + 1;

  return (
    <span
      title={`Niveau ${niveau}`}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${size === "lg" ? "text-xs px-3 py-1" : "text-[11px] px-2 py-0.5"} whitespace-nowrap ${STYLES[theme][niveau]} ${className}`}
    >
      <span className="inline-flex items-end gap-px" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-sm bg-current ${i <= rang ? "" : "opacity-25"}`}
            style={{ height: `${4 + i * 2}px` }}
          />
        ))}
      </span>
      {niveau}
    </span>
  );
}
