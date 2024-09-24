import React, { useState, useEffect } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import Home from '../src/pages/Home';
import Register from '../src/pages/Register';
import Login from '../src/pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext';
import Dashboard from './pages/Dashboard';
import SaveTheFrogs from './pages/save-the-treesandfrogs'

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 9000); // 9-second delay for testing
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContextProvider>
      {!showContent ? (
        <div className="animation-screen">
          <h1 className="fire-animation">
            {'Habit Tracker'.split('').map((letter, index) => (
              <span key={index} className="fire-letter" style={{ '--i': index }}>
                {letter}
              </span>
            ))}
          </h1>
          <p className="quote-text second-line">Do the best you can, until you know better.</p>
          <p className="quote-text third-line">Then when you know better, do better.</p>
        </div>
      ) : (
        <div className="main-content">
          <Navbar />
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/save-the-frogs" element={<SaveTheFrogs />} />
          </Routes>
        </div>
      )}
    </UserContextProvider>
  );
}

export default App;
