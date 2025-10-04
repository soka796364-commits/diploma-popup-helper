import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./pages/Index"; // adjust if your Index file is somewhere else

import "./index.css"; // optional, if you have a global CSS file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
