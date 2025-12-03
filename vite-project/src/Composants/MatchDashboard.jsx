import React from 'react';
import { NavLink } from 'react-router-dom'; // <--- Import indispensable

const MatchDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 relative z-10">
      
      {/* CONTAINER BLANC (-mt-24 pour chevaucher) */}
      <div className="-mt-24 bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-10 border border-gray-100">
        
        {/* --- PARTIE 1 : PROCHAIN MATCH --- */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Prochain match</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            
            {/* Infos */}
            <div className="text-left md:w-1/3">
              <div className="text-xl font-bold text-gray-900">25 Mai 2025</div>
              <div className="text-red-600 font-bold">20h30</div>
              <div className="text-gray-500 mt-1">Patinoire de Cholet</div>
            </div>

            {/* Duel */}
            <div className="flex items-center gap-6 md:w-1/3 justify-center">
               <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center border-4 border-red-600 shadow-md">
                 <span className="text-white font-bold">DOGZ</span>
               </div>
               <span className="text-2xl font-black text-gray-400 italic">VS</span>
               <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-400">
                 <span className="text-gray-600 text-xs font-bold">ADV</span>
               </div>
            </div>

            {/* Tag */}
            <div className="text-right md:w-1/3 hidden md:block">
               <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                 Amical / Loisir
               </span>
            </div>
          </div>

          {/* Bouton transformé en NavLink (block pour prendre la largeur si besoin) */}
          <NavLink 
            to="/calendrier" 
            className="inline-block mt-6 w-full md:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3 px-12 rounded-lg transition text-center"
          >
            Voir les détails
          </NavLink>
        </div>

        <hr className="border-gray-200 my-8" />

        {/* --- PARTIE 2 : RÉSULTATS --- */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">Résultats récents</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-normal">Date</th>
                  <th className="pb-3 font-normal">Match</th>
                  <th className="pb-3 font-normal text-right">Score</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 font-medium">25 Mai 2024</td>
                  <td className="py-4"><span className="font-bold">DOGZ</span> vs DGGX</td>
                  <td className="py-4 text-right font-bold text-green-600">4 — 2</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 font-medium">13 Mai 2024</td>
                  <td className="py-4">Équipe XXX vs <span className="font-bold">DOGZ</span></td>
                  <td className="py-4 text-right font-bold text-green-600">3 — 2</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            {/* Lien du bas transformé en NavLink */}
            <NavLink 
              to="/resultats" 
              className="text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wide transition-colors"
            >
              Voir tous les résultats →
            </NavLink>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MatchDashboard;