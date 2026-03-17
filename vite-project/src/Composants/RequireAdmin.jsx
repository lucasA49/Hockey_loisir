// src/Components/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const isAuth = (() => {
    try {
      const token = localStorage.getItem("dogz_token");
      if (!token) return false;

      // Vérifier que le token n'est pas expiré (décodage du payload sans lib)
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload?.exp) return false;
      return Date.now() / 1000 < payload.exp;
    } catch {
      return false;
    }
  })();

  if (!isAuth) {
    localStorage.removeItem("dogz_token");
    localStorage.removeItem("dogz_admin");
    return <Navigate to="/admin" replace />;
  }

  return children;
}
