import { NavLink } from "react-router-dom";
import { Users, Trophy, CalendarDays, UserCog } from "lucide-react";

export default function AdminNav() {
  const base =
    "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border";

  return (
    <nav className="w-full mb-5">
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2">
        <p className="text-[11px] text-slate-500 px-1 mb-2">Navigation admin</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:flex-row md:gap-3">
          <NavLink
            to="/admin/licencies"
            className={({ isActive }) =>
              `${base} ${
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
              `${base} ${
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
              `${base} ${
                isActive
                  ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                  : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
              }`
            }
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendrier</span>
          </NavLink>

          <NavLink
            to="/admin/comptes"
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? "bg-red-600/90 text-white border-red-500 shadow-md shadow-red-900/30"
                  : "bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
              }`
            }
          >
            <UserCog className="w-4 h-4" />
            <span>Comptes</span>
          </NavLink>

          <NavLink
            to="/"
            className={
              "flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-sm font-medium transition border " +
              "bg-slate-800/40 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white col-span-2 sm:col-span-1"
            }
          >
            ← <span>Retour site</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
