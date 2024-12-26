import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Markets from "../components/Markets";
import Portfolio from "../components/Portfolio";
import Profile from "../components/Profile";
import Home from "../components/Home";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="bg-gray-950 min-h-screen text-white">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/markets" element={<Markets/>} />
            <Route path="/portfolio" element={<Portfolio/>} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
