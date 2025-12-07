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
