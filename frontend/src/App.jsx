import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx"; 
import HomePage from "./pages/HomePage.jsx";
import RoomPage from "./pages/RoomPage.jsx"; 
import { AuthProvider } from './context/AuthContext';
import RegisterPage from "./pages/RegisterPage.jsx"; 
import LoginPage from "./pages/LoginPage.jsx"; 
import BookingsPage from "./pages/BookingsPage.jsx"; 
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms/:id" element={<RoomPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-bookings" element={<BookingsPage />} />
          <Route element={<ReportsPage />} path="/admin/reports" />
        </Routes>
      </div>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;

