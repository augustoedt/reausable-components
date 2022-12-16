import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles/globals.css";
import GlobalStyles from "./styles/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
)
