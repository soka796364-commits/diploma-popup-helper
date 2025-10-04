import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./pages/Index";
import "./index.css"; // or "./styles.css" if that’s what you use

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
