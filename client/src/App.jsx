import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import LockScreen from './shared/LockScreen';

const FIRST_VISIT_KEY = 'has_seen_welcome';
const PASSWORD_SETUP_KEY = 'password_setup_complete';
const SESSION_KEY = 'active_session';
const LAST_ACTIVITY_KEY = 'last_activity_time';
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const App = () => {
  const { user, isAuthenticated, isLocked, setIsLocked } = useAppContext();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldShowLock, setShouldShowLock] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we should show welcome screen
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(FIRST_VISIT_KEY);
    
    if (hasSeenWelcome === 'true') {
      setShowWelcome(false);
    } else {
      setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      }, 3000);
    }
  }, []);

  // Track user activity to prevent auto-lock during navigation
  useEffect(() => {
    const updateActivity = () => {
      if (user && !isLocked) {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity));

    updateActivity();

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
    };
  }, [user, isLocked]);

  // Check authentication and lock status
  useEffect(() => {
    const checkAuthState = async () => {
      setIsCheckingAuth(true);

      // Get session data
      const hasPasswordSetup = localStorage.getItem(PASSWORD_SETUP_KEY);
      const hasLocalPassword = localStorage.getItem('userPassword');
      const activeSession = localStorage.getItem(SESSION_KEY);
      const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
      const now = Date.now();

      // If not logged in, redirect to login
      if (!user && !isAuthenticated) {
        if (location.pathname !== '/' && location.pathname !== '/register') {
          navigate('/');
        }
        setIsCheckingAuth(false);
        return;
      }

      // If logged in but no password setup required
      if ((user || isAuthenticated) && !hasLocalPassword && !hasPasswordSetup) {
        // First time login - redirect to password setup
        if (location.pathname !== '/password') {
          navigate('/password');
        }
        setIsCheckingAuth(false);
        return;
      }

      // Check if we have an active session (user recently unlocked)
      if (activeSession === 'true') {
        // Check if session expired due to inactivity
        const idleTime = now - lastActivity;
        if (idleTime < LOCK_TIMEOUT) {
          // Session is still active, don't lock
          if (setIsLocked) setIsLocked(false);
          setShouldShowLock(false);
          setIsCheckingAuth(false);
          return;
        } else {
          // Session expired, clear it and lock
          localStorage.removeItem(SESSION_KEY);
        }
      }

      // If we have a local password, check if we should lock
      if (hasLocalPassword && hasPasswordSetup && (user || isAuthenticated)) {
        // Check if coming from password setup
        const isFromPasswordSetup = localStorage.getItem('just_setup_password');
        if (isFromPasswordSetup === 'true') {
          // First time after password setup - show lock
          if (setIsLocked) setIsLocked(true);
          setShouldShowLock(true);
          localStorage.removeItem('just_setup_password');
        } else if (!activeSession) {
          // No active session - check if should lock
          if (setIsLocked) setIsLocked(true);
          setShouldShowLock(true);
        } else {
          // Has active session - don't lock
          if (setIsLocked) setIsLocked(false);
          setShouldShowLock(false);
        }
      }

      setIsCheckingAuth(false);
    };

    // Small delay to ensure context is loaded
    setTimeout(() => {
      checkAuthState();
    }, 100);
  }, [user, isAuthenticated, location.pathname, navigate]);

  // Listen for isLocked changes from NavBar
  useEffect(() => {
    if (isLocked) {
      setShouldShowLock(true);
    }
  }, [isLocked]);

  // Handle unlocking from LockScreen
  const handleUnlock = () => {
    // Start a new session
    localStorage.setItem(SESSION_KEY, 'true');
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    if (setIsLocked) setIsLocked(false);
    setShouldShowLock(false);
  };

  // Show welcome screen
  if (showWelcome) {
    return <Welcome />;
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show lock screen if locked
if (shouldShowLock && (user || isAuthenticated) && location.pathname !== '/password') {
  return <LockScreen onUnlock={handleUnlock} />;
}

  return (
    <>
      <Toaster />
      
      {/* Show NavBar only on non-login pages when unlocked */}
{location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/password' && !shouldShowLock && <NavBar />}   
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