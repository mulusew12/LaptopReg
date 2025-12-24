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

const App = () => {
  const { user } = useAppContext();
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show welcome screen for 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    // Skip welcome if user is already logged in
    if (user) {
      setShowWelcome(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [user]);

  // Determine if NavBar should be shown
  const shouldShowNavBar = user && 
    location.pathname !== '/' && 
    location.pathname !== '/register' && 
    location.pathname !== '/success' && 
    location.pathname !== '/password';

  // Show welcome screen
  if (showWelcome) {
    return (
      <>
        <Toaster />
        <Welcome />
      </>
    );
  }

  return (
    <>
      <Toaster />
      
      {/* Conditionally render NavBar */}
      {shouldShowNavBar && <NavBar />}
      
      <div className={shouldShowNavBar ? " min-h-screen bg-gray-50" : "min-h-screen bg-gray-50"}>
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
          
          {/* Add Device Route - if you have this component */}
          {/* <Route 
            path="/add-device" 
            element={user ? <AddDevice /> : <Navigate to="/" replace />} 
          /> */}
          
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