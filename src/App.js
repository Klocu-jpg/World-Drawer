import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RouteEditor from "./pages/RouteEditor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<RouteEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
