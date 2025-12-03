import React from "react";

export default function Resultats() {
  // --- Données DEMO (à remplacer plus tard par ton backend) ---
  const recent = [
    { id: 1, date: "13 janvier 2025", adversaire: "Angers Loisirs", score: "4 - 2", lieu: "Domicile" },
    { id: 2, date: "20 décembre 2024", adversaire: "Nantes", score: "3 - 3", lieu: "Extérieur" },
    { id: 3, date: "10 décembre 2024", adversaire: "Cholet Loisirs 2", score: "2 - 5", lieu: "Domicile" },
  ];

  const allResults = [
    { id: 4, date: "1 décembre 2024", adversaire: "La Roche", score: "5 - 1", lieu: "Extérieur" },
    { id: 5, date: "20 novembre 2024", adversaire: "Tours Loisirs", score: "2 - 2", lieu: "Domicile" },
    { id: 6, date: "5 novembre 2024", adversaire: "Nantes", score: "1 - 3", lieu: "Extérieur" },
    { id: 7, date: "22 octobre 2024", adversaire: "Angers", score: "4 - 4", lieu: "Domicile" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 md:px-10 md:py-10">
      
      {/* Titre principal */}
      <h1 className="text-3xl font-extrabold tracking-wide mb-6 text-center uppercase">
        Résultats des Matchs
      </h1>

      {/* Résultats récents */}
      <section className="max-w-3xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-3">Résultats récents</h2>

        <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-md">
          {recent.map((m, index) => (
            <div
              key={m.id}
              className={`px-4 py-3 flex items-center justify-between ${
                index !== recent.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{m.date}</p>
                <p className="text-xs text-slate-600">vs {m.adversaire}</p>
                <p className="text-xs text-slate-500">{m.lieu}</p>
              </div>

              <span className="text-sm font-bold">{m.score}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Résultats complets */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Résultats complets</h2>

        <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-md">
          {allResults.map((m, index) => (
            <div
              key={m.id}
              className={`px-4 py-3 flex items-center justify-between ${
                index !== allResults.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{m.date}</p>
                <p className="text-xs text-slate-600">vs {m.adversaire}</p>
                <p className="text-xs text-slate-500">{m.lieu}</p>
              </div>

              <span className="text-sm font-bold">{m.score}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition">
            Charger plus de résultats
          </button>
        </div>
      </section>
    </div>
  );
}
