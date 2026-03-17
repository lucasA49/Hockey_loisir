// src/utils/authFetch.js
// Wrapper fetch qui ajoute le token JWT et gère l'expiration automatique
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("dogz_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Token invalide ou expiré → on nettoie et on redirige vers la connexion
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("dogz_token");
    localStorage.removeItem("dogz_admin");
    window.location.href = "/admin";
    return res;
  }

  return res;
}
