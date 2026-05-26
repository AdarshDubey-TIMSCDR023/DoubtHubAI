import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";

import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{

          duration: 3000,

          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid #1e293b",
            padding: "16px",
            borderRadius: "16px",
          },

          success: {
            iconTheme: {
              primary: "#06b6d4",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Main App */}
      <App />

    </BrowserRouter>

  </React.StrictMode>
);