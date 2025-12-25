import React, { useState } from 'react';
import {
  FaBell,
  FaLockOpen,
  FaUser,
  FaBars,
  FaLock,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaHome,
  FaList,
  FaChartBar,
  FaUserPlus
} from 'react-icons/fa';
import { useAppContext } from '../auth/Context';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isDarkMode, setIsDarkMode } = useAppContext();
  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [logwarn, setLogwarn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setMobileMenuOpen(false); // Close mobile menu when opening any dropdown
  };

  const handleLockPage = () => {
    const userPassword = localStorage.getItem('userPassword');

    if (userPassword) {
      setIsLocked(true);
      setOpenMenu(null);
      setPasswordInput('');
      setError('');
      setMobileMenuOpen(false);
    } else {
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-24 right-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-[10000] animate-fadeIn';
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Please set a password first</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  };

  const handleUnlock = () => {
    const storedPassword = localStorage.getItem('userPassword');

    if (passwordInput === storedPassword) {
      setIsLocked(false);
      setPasswordInput('');
      setError('');
      // Show success feedback
      const success = document.createElement('div');
      success.className = 'fixed top-24 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-[10000] animate-fadeIn';
      success.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Successfully unlocked!</span>
        </div>
      `;
      document.body.appendChild(success);
      setTimeout(() => {
        success.classList.add('animate-fadeOut');
        setTimeout(() => document.body.removeChild(success), 300);
      }, 2000);
    } else {
      setError('Incorrect password. Please try again.');
      setPasswordInput('');
      // Shake animation on error
      const input = document.querySelector('input[type="password"]');
      if (input) {
        input.classList.add('animate-shake');
        setTimeout(() => input.classList.remove('animate-shake'), 500);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const notifications = [
    { id: 1, title: 'New laptop registration', message: 'John Doe registered a new laptop', time: '2 min ago', unread: true },
    { id: 2, title: 'Verification required', message: '3 laptops pending verification', time: '10 min ago', unread: true },
    { id: 3, title: 'System update', message: 'Dashboard updated to v2.1', time: '1 hour ago', unread: false },
    { id: 4, title: 'Security alert', message: 'Unusual login detected', time: '2 hours ago', unread: false },
  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;

  // Navigation menu items
  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: <FaUserPlus />, label: 'Register', path: '/register', active: location.pathname === '/register' },
    { icon: <FaList />, label: 'All Lists', path: '/list', active: location.pathname === '/list' },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports', active: location.pathname === '/reports' },
  ];

  // Theme classes
  const theme = {
    bg: isDarkMode ? 'bg-gray-900/95' : 'bg-white/95',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800/90' : 'bg-white/90',
    shadow: isDarkMode ? 'shadow-lg shadow-black/20' : 'shadow-lg shadow-gray-200',
  };

  return (
    <>
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-fadeOut { animation: fadeOut 0.3s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
          .animate-slideIn { animation: slideIn 0.3s ease-out; }
        `}
      </style>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`fixed top-0 right-0 h-full w-64 ${theme.bg} ${theme.shadow} z-50 p-4 animate-slideIn`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold ${theme.text}`}>Menu</h3>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <FaTimes className={theme.text} />
              </button>
            </div>

            {/* Navigation Links */}
          // In NavBar.js, modify the header section to conditionally show elements:

{/* Desktop Navigation Links - Hidden on mobile */}
{user && ( // Only show navigation links if user is logged in
  <div className="hidden md:flex items-center gap-1">
    {navItems.map((item) => (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`px-4 py-2 rounded-lg transition-all ${
          item.active 
            ? isDarkMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-700'
            : `${theme.text} ${theme.hover}`
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>
)}

{/* Right Side Actions - Show different content based on auth */}
<div className="flex items-center gap-2">
  {/* Show theme toggle for both logged in and logged out */}
  <div className="hidden sm:block">
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`p-2.5 rounded-lg ${theme.hover} transition-all`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Theme toggle icon remains the same */}
    </button>
  </div>

  {/* Show different icons based on authentication */}
  {user ? (
    // Logged in user sees these
    <div className="hidden sm:flex items-center gap-2">
      {/* Notifications, Security, Profile icons */}
    </div>
  ) : (
    // Logged out user sees login/signup buttons
    <div className="hidden sm:flex items-center gap-3">
      <button
        onClick={() => navigate('/')}
        className={`px-4 py-2 rounded-lg ${theme.hover} ${theme.text}`}
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        Sign Up
      </button>
    </div>
  )}

  {/* Mobile menu button - always visible */}
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className={`p-2.5 rounded-lg sm:hidden ${theme.hover}`}
  >
    {mobileMenuOpen ? (
      <FaTimes className={theme.text} />
    ) : (
      <FaBars className={theme.text} />
    )}
  </button>
</div>

            {/* User Profile */}
            <div className="border-t pt-4 border-gray-700/50">
              <div className="flex items-center gap-3 p-3">
                <div className={`w-10 h-10 rounded-full ${
                  isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                } flex items-center justify-center`}>
                  <FaUser className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />
                </div>
                <div>
                  <p className={`font-medium ${theme.text}`}>{user?.name || 'User'}</p>
                  <p className={`text-sm ${theme.textSecondary}`}>Administrator</p>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-2 mt-6">
              <button
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} ${theme.text}`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={handleLockPage}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} ${theme.text}`}
              >
                <FaLock />
                <span>Lock Screen</span>
              </button>

              <button
                onClick={() => setLogwarn(true)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'hover:bg-red-900/50 text-red-300' : 'hover:bg-red-100 text-red-600'
                }`}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main NavBar */}
      <header className={`fixed top-0 left-0 w-full z-30 ${isDarkMode ? 'bg-gray-900': 'bg-gray-100'} ${theme.border} border-b ${theme.shadow}`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/aastuLogo.png"
                alt="AASTU Logo"
                className="w-10 h-10 object-contain"
              />
              <div className='hidden md:block'>
                <h1 className={`text-lg font-bold ${theme.text}`}>
                  AASTU Portal
                </h1>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Laptop Management
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  item.active 
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700'
                    : `${theme.text} ${theme.hover}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Desktop */}
            <div className="hidden sm:block">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-lg ${theme.hover} transition-all`}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Icons - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('bell')}
                  className={`p-2.5 rounded-lg ${theme.hover} transition-all relative`}
                >
                  <FaBell className={theme.text} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {openMenu === 'bell' && (
                  <div className={`absolute right-0 top-12 w-80 ${theme.cardBg} backdrop-blur-lg border ${theme.border} rounded-xl shadow-2xl z-40 animate-fadeIn`}>
                    <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${theme.border}`}>
                      <h3 className={`font-bold ${theme.text}`}>Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((note) => (
                        <div key={note.id} className={`p-3 border-b ${theme.border} ${note.unread && (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50')}`}>
                          <p className={`font-medium ${theme.text}`}>{note.title}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{note.message}</p>
                          <p className={`text-xs ${theme.textSecondary} mt-1`}>{note.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Security */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('lock')}
                  className={`p-2.5 rounded-lg ${theme.hover} transition-all`}
                >
                  <FaShieldAlt className={theme.text} />
                </button>

                {openMenu === 'lock' && (
                  <div className={`absolute right-0 top-12 w-64 ${theme.cardBg} backdrop-blur-lg border ${theme.border} rounded-xl shadow-2xl z-40 animate-fadeIn`}>
                    <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${theme.border}`}>
                      <h3 className={`font-bold ${theme.text}`}>Security</h3>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLockPage}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} ${theme.text}`}
                      >
                        <FaLock />
                        <span>Lock Page</span>
                      </button>
                      <button
                        onClick={() => navigate('/password')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} ${theme.text}`}
                      >
                        <FaKey />
                        <span>Change Password</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('profile')}
                  className={`p-2.5 rounded-lg ${theme.hover} transition-all flex items-center gap-2`}
                >
                  <FaUser className={theme.text} />
                  <span className={`hidden lg:inline ${theme.text}`}>{user?.name?.split(' ')[0] || 'User'}</span>
                </button>

                {openMenu === 'profile' && (
                  <div className={`absolute right-0 top-12 w-64 ${theme.cardBg} backdrop-blur-lg border ${theme.border} rounded-xl shadow-2xl z-40 animate-fadeIn`}>
                    <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                          <FaUser className={theme.text} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${theme.text}`}>{user?.name || 'User'}</h3>
                          <p className={`text-sm ${theme.textSecondary}`}>{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => setLogwarn(true)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                          isDarkMode ? 'hover:bg-red-900/50 text-red-300' : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-lg sm:hidden ${theme.hover}`}
            >
              {mobileMenuOpen ? (
                <FaTimes className={theme.text} />
              ) : (
                <FaBars className={theme.text} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {logwarn && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
          <div 
            className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/40'} backdrop-blur-sm`}
            onClick={() => setLogwarn(false)}
          />
          <div className={`relative rounded-xl ${theme.shadow} max-w-sm w-full p-6 border ${theme.border} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className='flex justify-center mb-4'>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <FaSignOutAlt className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${theme.text}`}>
              Confirm Logout
            </h3>
            <p className={`text-center mb-6 ${theme.textSecondary}`}>
              Are you sure you want to sign out?
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setLogwarn(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium ${theme.hover} ${theme.text}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setLogwarn(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Screen Overlay */}
      {isLocked && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
          <div className={`rounded-xl ${theme.shadow} max-w-md w-full p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaLock className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} size={32} />
              </div>
            </div>
            <h1 className={`text-3xl font-bold text-center mb-2 ${theme.text}`}>
              Session Locked
            </h1>
            <p className={`text-center mb-6 ${theme.textSecondary}`}>
              Enter your password to continue
            </p>
            <div className="mb-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                className={`w-full p-3 rounded-lg border ${
                  error 
                    ? 'border-red-500 focus:border-red-500' 
                    : isDarkMode 
                      ? 'border-gray-700 bg-gray-900 focus:border-blue-500' 
                      : 'border-gray-300 focus:border-blue-500'
                } ${theme.text} focus:outline-none`}
                autoFocus
              />
              {error && (
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUnlock}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Unlock
              </button>
              <button
                onClick={() => {
                  setIsLocked(false);
                  setPasswordInput('');
                  setError('');
                  navigate('/password');
                }}
                className={`py-3 px-4 rounded-lg font-medium ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Forgot?
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;