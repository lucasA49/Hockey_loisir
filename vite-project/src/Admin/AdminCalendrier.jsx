import { NavLink } from "react-router-dom";
import { Users, Trophy, CalendarDays } from "lucide-react";

export default function AdminCalendrier() {
  const navBase =
    "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border";

  const eventsDemo = [
    {
      id: 1,
      date: "Dimanche 14 décembre 2025",
      time: "11h45",
      titre: "Match vs Angers Loisirs",
      statut: "Confirmé",
    },
    {
      id: 2,
      date: "Samedi 20 décembre 2025",
      time: "20h30",
      titre: "Match vs Nantes",
      statut: "À confirmer",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6 md:px-8 md:py-8">
      {/* Titre */}
      <h1 className="text-xl md:text-2xl font-bold mb-1">
        Admin – Calendrier
      </h1>

      {/* NAV ADMIN au même endroit que Dashboard */}
      <nav className="w-full mb-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2">
          <p className="text-[11px] text-slate-500 px-1 mb-2">
            Navigation admin
          </p>

          <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:gap-3">
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
        Gestion des événements et matchs dans le calendrier.
      </p>

      {/* GRID : formulaire + liste */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* FORMULAIRE ÉVÉNEMENT */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            Ajouter un événement
          </h2>

          <form className="space-y-3 text-xs md:text-sm">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Date</label>
              <input
                type="date"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Heure</label>
              <input
                type="time"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Titre / Match</label>
              <input
                type="text"
                placeholder="Match vs Angers, déplacement..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Statut</label>
              <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
                <option>Confirmé</option>
                <option>À confirmer</option>
                <option>Annulé</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full bg-slate-700 hover:bg-slate-600 text-xs md:text-sm font-semibold rounded-lg py-2 transition"
            >
              Ajouter l&apos;événement
            </button>
          </form>
        </section>

        {/* LISTE DES ÉVÉNEMENTS */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            Événements à venir
          </h2>

          <div className="bg-slate-900/60 rounded-xl divide-y divide-slate-800">
            {eventsDemo.map((e) => (
              <div
                key={e.id}
                className="px-3 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs md:text-sm font-semibold">
                    {e.date} • {e.time}
                  </p>
                  <p className="text-[11px] text-slate-400">{e.titre}</p>
                  <p className="text-[11px] text-slate-500">
                    Statut : {e.statut}
                  </p>
                </div>
                <button className="text-[11px] text-slate-300 border border-slate-600 rounded-full px-3 py-1 hover:bg-slate-800">
                  Modifier
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
