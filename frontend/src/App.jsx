import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx"; 
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;