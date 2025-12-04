// src/Components/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  // Très simple : si on n'a pas d'admin dans le localStorage -> on renvoie vers /admin
  const isAuth = (() => {
    try {
      const raw = localStorage.getItem("dogz_admin");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return !!parsed?.email; // on vérifie qu'il y a au moins un email
    } catch {
      return false;
    }
  })();

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
