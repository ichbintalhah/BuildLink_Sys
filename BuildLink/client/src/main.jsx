import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // <-- Uncommented

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* <-- Uncommented */}
        <App />
      </AuthProvider>{" "}
      {/* <-- Uncommented */}
    </BrowserRouter>
  </React.StrictMode>
);
