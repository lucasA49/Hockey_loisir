import React, { useState } from 'react';

// Composant du formulaire de Connexion
export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fonction qui sera appelée à la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Les données prêtes à être envoyées à votre API (backend/base de données)
    const formData = {
      username: username,
      password: password,
    };

    console.log('Données à envoyer à la base de données (API) :', formData);

    // --- LOGIQUE D'ENVOI À L'API À IMPLÉMENTER ICI ---
    // Exemple : 
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // }).then(...)
    // --------------------------------------------------
  };

  return (
    // Conteneur centré (pour la démo)
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* Carte du Formulaire (Design simple Tailwind) */}
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Connexion Admin
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Pseudo/Nom d'utilisateur */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pseudo
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Nom d'utilisateur Admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
            />
          </div>
          
          {/* Champ Mot de passe */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="●●●●●●●●"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
            />
          </div>
          
          {/* Bouton de Soumission */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Se connecter
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}