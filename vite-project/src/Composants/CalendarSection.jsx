// src/components/MatchCalendar.jsx

export default function MatchCalendar() {
  // Données de DEMO pour montrer à l’équipe
  const matches = [
    {
      id: 1,
      date: "Dimanche 14 décembre 2025",
      time: "11h45",
      adversaire: "Angers",
      lieu: "Domicile",
      statut: "Confirmé",
    },
    {
      id: 2,
      date: "Samedi 20 décembre 2025",
      time: "20h30",
      adversaire: "Nantes Loisirs",
      lieu: "Extérieur",
      statut: "À confirmer",
    },
    {
      id: 3,
      date: "Vendredi 10 janvier 2026",
      time: "21h15",
      adversaire: "Cholet Loisirs 2",
      lieu: "Domicile",
      statut: "Confirmé",
    },
  ];

  return (
    <section className="px-4 py-8 max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold tracking-wide text-white text-center mb-4 uppercase">
        Calendrier des matchs
      </h2>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {matches.map((m, index) => (
          <div
            key={m.id}
            className={`px-4 py-3 flex items-center justify-between ${
              index !== matches.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            {/* Informations */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {m.date} • {m.time}
              </span>
              <span className="text-xs text-slate-600">Match vs {m.adversaire}</span>
              <span className="text-xs text-slate-500">{m.lieu}</span>
            </div>

            {/* Badge */}
            <span
              className={`
                text-[11px] font-semibold px-3 py-1 rounded-full
                ${
                  m.statut === "Confirmé"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }
              `}
            >
              {m.statut}
            </span>
          </div>
        ))}

        <div className="border-t border-slate-100 px-4 py-3">
          <button className="w-full text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full px-4 py-2 transition">
            Voir tous les matchs
          </button>
        </div>
      </div>
    </section>
  );
}
