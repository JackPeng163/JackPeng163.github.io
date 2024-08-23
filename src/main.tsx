import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import InputPage from "./pages/InputPage";
import Weighting from "./pages/Weighting";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/input-page" element={<InputPage />} />
        <Route path="/weighting" element={<Weighting />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
