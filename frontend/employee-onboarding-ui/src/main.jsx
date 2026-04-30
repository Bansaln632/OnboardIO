import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./context/ToastContext";
import "./styles/app.css";

// Google Sign-In is handled by backend Spring Security OAuth2
// No frontend Google OAuth library needed - just redirects to backend
// Configuration is in backend/src/main/resources/application.properties

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);
