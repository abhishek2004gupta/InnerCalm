import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import GroupTherapy from './components/GroupTherapy';
import IndividualTherapy from './components/IndividualTherapy';
import CouplesTherapy from './components/CouplesTherapy';
import FamilyTherapy from './components/FamilyTherapy';
import Chatbot from './components/Chatbot';
import ChatSummary from './components/ChatSummary';
import Policies from './components/Policies';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import TherapistDashboard from './components/TherapistDashboard';
import AdminScheduleMeeting from './components/AdminScheduleMeeting';
import TherapyConfirmation from './components/TherapyConfirmation';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/individual" element={<IndividualTherapy />} />
            <Route path="/services/group" element={<GroupTherapy />} />
            <Route path="/services/couples" element={<CouplesTherapy />} />
            <Route path="/services/family" element={<FamilyTherapy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat-summary"
              element={
                <ProtectedRoute>
                  <ChatSummary />
                </ProtectedRoute>
              }
            />
            <Route path="/policies" element={<Policies />} />
            <Route path="/privacy" element={<Policies />} />
            <Route path="/terms" element={<Policies />} />
            <Route path="/accessibility" element={<Policies />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
            <Route path="/admin/schedule-meeting" element={<AdminScheduleMeeting />} />
            <Route path="/therapy-confirmation" element={<TherapyConfirmation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
