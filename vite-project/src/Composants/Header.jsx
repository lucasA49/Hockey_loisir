import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import essentiel

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour gérer le style des liens (Actif vs Inactif)
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-gray-900 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider" // Style si page active
      : "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors"; // Style par défaut

  // Style spécifique pour le mobile
  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block px-3 py-4 rounded-md text-base font-bold text-white bg-gray-800"
      : "block px-3 py-4 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800";

  return (
    <nav className="bg-black text-white shadow-md w-full relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* --- PARTIE GAUCHE --- */}
          <div className="flex-1 flex items-center justify-start">
            {/* BOUTON BURGER (Mobile) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* NAVIGATION PC (Liens écrits en dur) */}
            <div className="hidden md:flex space-x-4">
              <NavLink to="/" className={linkClass}>
                Accueil
              </NavLink>

              <NavLink to="/calendrier" className={linkClass}>
                Calendrier
              </NavLink>

              <NavLink to="/resultats" className={linkClass}>
                Résultats
              </NavLink>
            </div>
          </div>

          {/* --- PARTIE CENTRALE : LOGO --- */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <NavLink to="/" className="flex items-center">
              <div>
                <img
                  className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-black font-bold border-2 border-gray-500"
                  src="/logo.jpg"
                  alt="Logo"
                />
              </div>
            </NavLink>
          </div>

          {/* --- PARTIE DROITE : ADMIN --- */}
          <div className="flex-1 flex items-center justify-end">
            <NavLink
              to="/admin"
              className="text-gray-300 hover:text-white font-medium text-sm flex items-center gap-2"
            >
              <span className="hidden md:inline">Espace Staff</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </NavLink>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE DÉROULANT --- */}
      {isOpen && (
        <div className="md:hidden bg-black absolute top-20 left-0 w-full shadow-xl border-t border-gray-800 z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <NavLink
              to="/"
              className={mobileLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </NavLink>

            <NavLink
              to="/calendrier"
              className={mobileLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Calendrier
            </NavLink>

            <NavLink
              to="/resultats"
              className={mobileLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Résultats
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
