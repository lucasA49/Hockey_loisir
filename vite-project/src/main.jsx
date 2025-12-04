import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Pages publiques
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Resultat from "./Pages/Resultat.jsx";
import Calendar from "./Pages/Calendar.jsx";

// Pages admin
import AdminPanel from "./Pages/AdminPanel.jsx";
import AdminLicencies from "./Admin/AdminLicencies.jsx";
import AdminResultats from "./Admin/AdminResultas.jsx";
import AdminCalendrier from "./Admin/AdminCalendrier.jsx";

// Protection admin
import RequireAdmin from "./Composants/RequireAdmin.jsx";

const router = createBrowserRouter([
  // -------------------------
  // PAGES PUBLIQUES
  // -------------------------
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Login />,
  },
  {
    path: "/calendrier",
    element: <Calendar />,
  },
  {
    path: "/resultats",
    element: <Resultat />,
  },

  // -------------------------
  // PAGES ADMIN (PROTÉGÉES)
  // -------------------------
  {
    path: "/admindashboard",
    element: (
      <RequireAdmin>
        <AdminPanel />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/licencies",
    element: (
      <RequireAdmin>
        <AdminLicencies />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/resultats",
    element: (
      <RequireAdmin>
        <AdminResultats />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/calendrier",
    element: (
      <RequireAdmin>
        <AdminCalendrier />
      </RequireAdmin>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
