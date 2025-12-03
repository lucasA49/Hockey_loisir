import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-950/95 text-slate-300">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        
        {/* Ligne du haut */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Nom équipe */}
          <div>
            <p className="text-sm font-semibold text-white">Équipe DOGZ Cholet</p>
            <p className="text-xs text-slate-400">
              Plateforme interne pour suivre les matchs & résultats.
            </p>
          </div>

          {/* Navigation footer */}
          <nav className="flex flex-wrap items-center gap-3 text-xs md:text-[13px]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-2 py-1 rounded-full transition ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              Accueil
            </NavLink>

            <NavLink
              to="/matchs"
              className="px-2 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
            >
              Matchs
            </NavLink>

            <NavLink
              to="/resultats"
              className="px-2 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
            >
              Résultats
            </NavLink>

            <NavLink
              to="/calendrier"
              className="px-2 py-1 rounded-full hover:bg-slate-800 hover:text-white transition"
            >
              Calendrier
            </NavLink>
          </nav>
        </div>

        {/* Bas du footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} DOGZ Cholet — Site interne de l’équipe.
          </p>

          <p className="text-[11px] text-slate-600">
            Gestion des matchs, résultats et calendrier.
          </p>
        </div>
      </div>
    </footer>
  );
}
