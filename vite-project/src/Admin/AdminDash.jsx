import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Users, Trophy, CalendarDays } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Données provisoires (pour l'instant pas de backend)
  const licenciesDemo = [
    { id: 1, licence: "123456", nom: "Marc Boutin", statut: "Actif" },
    { id: 2, licence: "654321", nom: "Jean Dubois", statut: "Actif" },
    { id: 3, licence: "837162", nom: "Paul Durand", statut: "Repos" },
    { id: 4, licence: "219873", nom: "Alain Morel", statut: "Blessé" },
    { id: 5, licence: "679813", nom: "Thomas Lefevre", statut: "Actif" },
  ];

  const [licencies] = useState(licenciesDemo);

  const navBase =
    "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border";

  const handleLogout = () => {
    localStorage.removeItem("dogz_admin");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      {/* Header admin + bouton déconnexion */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl md:text-2xl font-bold">Panel Admin</h1>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 hover:text-white transition"
        >
          Déconnexion
        </button>
      </div>

      {/* NAVIGATION ADMIN DANS LE STYLE DU DASHBOARD */}
      <nav className="w-full mb-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2">
          <p className="text-[11px] text-slate-500 px-1 mb-2">
            Navigation admin
          </p>

          <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:gap-3">
            {/* LICENCIÉS */}
            <NavLink
              to="/admin/licencies"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span>Licenciés</span>
            </NavLink>

            {/* RÉSULTATS */}
            <NavLink
              to="/admin/resultats"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <Trophy className="w-4 h-4" />
              <span>Résultats</span>
            </NavLink>

            {/* CALENDRIER */}
            <NavLink
              to="/admin/calendrier"
              className={({ isActive }) =>
                `${navBase} ${
                  isActive
                    ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                    : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`
              }
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendrier</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <p className="text-xs md:text-sm text-slate-400 mb-4">
        Gestion des licenciés, résultats et calendrier.
      </p>

      {/* === GRID PRINCIPALE === */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* LICENCIÉS (2/3) */}
        <section className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            Licenciés de l’équipe
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-2 pr-4">N° licence</th>
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2">Statut</th>
                </tr>
              </thead>

              <tbody>
                {licencies.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/60 last:border-b-0"
                  >
                    <td className="py-2 pr-4 whitespace-nowrap">{p.licence}</td>
                    <td className="py-2 pr-4">{p.nom}</td>

                    <td className="py-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                          p.statut === "Actif"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : p.statut === "Blessé"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* COLONNE DE DROITE : score + événements */}
        <div className="flex flex-col gap-4">
          {/* FORMULAIRE SCORE */}
          <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Enregistrer un score
            </h2>

            <form className="space-y-3 text-xs md:text-sm">
              {/* DATE */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Date du match</label>
                <input
                  type="date"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* ADVERSAIRE */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Adversaire</label>
                <input
                  type="text"
                  placeholder="Nom de l'équipe"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* SCORE */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-slate-400 text-[11px]">DOGZ</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <span className="text-slate-400 text-xs">-</span>

                <div className="flex-1">
                  <label className="text-slate-400 text-[11px]">
                    Adversaire
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* BTN */}
              <button
                type="button"
                className="w-full bg-red-600 hover:bg-red-700 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
              >
                Enregistrer
              </button>
            </form>
          </section>

          {/* FORMULAIRE ÉVÉNEMENTS */}
          <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Ajouter un événement
            </h2>

            <form className="space-y-3 text-xs md:text-sm">
              {/* DATE */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Date</label>
                <input
                  type="date"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* HEURE */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Heure</label>
                <input
                  type="time"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* TITRE */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Titre / Match</label>
                <input
                  type="text"
                  placeholder="Match vs Angers, déplacement..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* STATUT */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">Statut</label>
                <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                  <option>Confirmé</option>
                  <option>À confirmer</option>
                  <option>Annulé</option>
                </select>
              </div>

              {/* BTN */}
              <button
                type="button"
                className="w-full bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
              >
                Ajouter
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
