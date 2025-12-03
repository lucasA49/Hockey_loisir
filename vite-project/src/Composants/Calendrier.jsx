import React from "react";

export default function Calendrier() {
  // ---- Données DEMO (à remplacer plus tard par API backend) ----
  const upcoming = [
    {
      id: 1,
      date: "Dimanche 14 décembre 2025",
      time: "11h45",
      adversaire: "Angers Loisirs",
      lieu: "Domicile",
      statut: "Confirmé",
    },
    {
      id: 2,
      date: "Samedi 20 décembre 2025",
      time: "20h30",
      adversaire: "Nantes",
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
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 md:px-10 md:py-10">

      {/* Titre */}
      <h1 className="text-3xl font-extrabold tracking-wide text-center uppercase mb-6">
        Calendrier des Matchs
      </h1>

      <p className="text-center text-sm text-slate-400 mb-8">
        Prochains matchs programmés pour l’équipe DOGZ
      </p>

      {/* Bloc calendrier */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-white text-slate-900 rounded-3xl shadow-lg overflow-hidden">

          {upcoming.map((m, index) => (
            <div
              key={m.id}
              className={`px-4 py-4 flex items-center justify-between ${
                index !== upcoming.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              {/* Partie gauche : date + info */}
              <div>
                <p className="text-sm font-semibold">
                  {m.date} • {m.time}
                </p>

                <p className="text-xs text-slate-600">Match vs {m.adversaire}</p>

                <p className="text-xs text-slate-500">{m.lieu}</p>
              </div>

              {/* Badge statut */}
              <span
                className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                  m.statut === "Confirmé"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {m.statut}
              </span>
            </div>
          ))}

        </div>

        {/* Bas de page calendrier */}
        <div className="text-center mt-6">
          <button className="text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition">
            Charger plus de matchs
          </button>
        </div>
      </section>
    </div>
  );
}
