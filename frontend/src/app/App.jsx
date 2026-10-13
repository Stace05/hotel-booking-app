import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../widgets/header/ui/Header.jsx";
import Footer from "../widgets/footer/ui/Footer.jsx"; 
import { AuthProvider } from './providers/AuthContext.jsx';
import HomePage from "../pages/HomePage.jsx";
import RoomPage from "../pages/RoomPage.jsx"; 
import RegisterPage from "../pages/RegisterPage.jsx"; 
import LoginPage from "../pages/LoginPage.jsx"; 
import BookingsPage from "../pages/BookingsPage.jsx"; 
import ReportsPage from '../pages/ReportsPage.jsx';
import AddRoomPage from '../pages/AddRoomPage.jsx';

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
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/add-room" element={<AddRoomPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;