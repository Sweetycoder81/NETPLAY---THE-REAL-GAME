import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Courts from './pages/Courts';
import CourtDetail from './pages/CourtDetail';
import Dashboard from './pages/Dashboard';
import NearMe from './pages/NearMe';
import Turfs from './pages/Turfs';
import Packages from './pages/Packages';
import './App.css';

function App() {
  const isAuthed = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={isAuthed ? <MainLayout><Home /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/courts" element={isAuthed ? <MainLayout><Courts /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/courts/:id" element={isAuthed ? <MainLayout><CourtDetail /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isAuthed ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/near-me" element={isAuthed ? <MainLayout><NearMe /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/turfs" element={isAuthed ? <MainLayout><Turfs /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="/packages" element={isAuthed ? <MainLayout><Packages /></MainLayout> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
