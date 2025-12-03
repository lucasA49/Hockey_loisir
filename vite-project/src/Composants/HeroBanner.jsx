import React from 'react';
import { NavLink } from 'react-router-dom'; // <--- Import indispensable

const HeroBanner = () => {
  return (
    <div className="relative h-[500px] w-full bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      
      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src="https://images.unsplash.com/photo-1515703407324-5f75366f216e?q=80&w=2070&auto=format&fit=crop" 
          alt="Hockey Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
      </div>

      {/* CONTENU */}
      <div className="relative z-10 text-center px-4 mb-20">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-2">
          DOGZ Cholet
        </h1>
        <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-6">
          Hockey Loisir
        </h2>
        <p className="text-gray-400 italic mb-8 text-lg">
          "Ambiance, fair-play, passion."
        </p>

        {/* BOUTONS (Devenus des NavLink) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* Lien vers le Calendrier */}
          <NavLink 
            to="/calendrier" 
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-1 text-center"
          >
            Voir le prochain match
          </NavLink>

          {/* Lien vers Contact */}
          <NavLink 
            to="/contact" 
            className="bg-transparent border-2 border-red-700 text-red-100 hover:bg-red-700 hover:text-white font-bold py-3 px-8 rounded-lg transition text-center"
          >
            Nous rejoindre
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;