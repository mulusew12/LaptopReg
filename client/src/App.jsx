import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavBar from './admin/NavBar';
import Dashboard from './admin/Dashboard';
import Login from './users/Login';
import Registration from './users/Registration';
import { useAppContext } from './auth/Context';
import Lists from './admin/Lists';
import Verify from './admin/Verify';
import { Toaster } from 'react-hot-toast';
import Success from './shared/Success';
import Password from './shared/Password';
import Welcome from './shared/Welcome';

const FIRST_VISIT_KEY = 'has_seen_welcome';

const App = () => {
  const { user } = useAppContext();
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user has already seen welcome page
    const hasSeenWelcome = localStorage.getItem(FIRST_VISIT_KEY);
    
    // If user has seen welcome before, skip it
    if (hasSeenWelcome === 'true') {
      setShowWelcome(false);
      return;
    }
    
    // Only set timer if we're showing welcome
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Mark as seen only when it completes naturally
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show welcome screen
  if (showWelcome) {
    return <Welcome />;
  }

  return (
    <>
      <Toaster />
      
      {/* Always show NavBar on all pages */}
      <NavBar />
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Login/> : <Registration />} 
          />
          <Route path="/success" element={<Success />} />
          <Route path="/password" element={<Password />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/list" 
            element={user ? <Lists /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/verify/:id" 
            element={user ? <Verify /> : <Navigate to="/" replace />} 
          />
          
          {/* Redirect unknown routes */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
          />
        </Routes>
      </div>
    </>
  );
};

export default App;