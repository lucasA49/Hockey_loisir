import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Resultat from "./Pages/Resultat.jsx";
import Calendar from "./Pages/Calendar.jsx";


const router = createBrowserRouter([
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
  {
    path: "/",
    element: <Home />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
