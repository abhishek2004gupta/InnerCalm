import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/chat-summary" element={<ChatSummary />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/privacy" element={<Policies />} />
            <Route path="/terms" element={<Policies />} />
            <Route path="/accessibility" element={<Policies />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
