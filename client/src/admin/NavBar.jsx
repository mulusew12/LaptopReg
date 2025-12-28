import React, { useState } from 'react';
import {
  FaBell,
  FaLockOpen,
  FaUser,
  FaBars,
  FaLock,
  FaKey,
  FaSignOutAlt,
  FaEye,
  FaShieldAlt,
  FaTimes,
  FaHome,
  FaList,
  FaChartBar,
  FaUserPlus
} from 'react-icons/fa';
import { useAppContext } from '../auth/Context';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isDarkMode, setIsDarkMode, isLocked, setIsLocked } = useAppContext();
  const [openMenu, setOpenMenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [logwarn, setLogwarn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setMobileMenuOpen(false);
  };

  // Updated handleLockPage function to use context
// Updated handleLockPage function in NavBar.js
// Fixed handleLockPage function in NavBar.js
const handleLockPage = () => {
  const userPassword = localStorage.getItem('userPassword');
  const isAuthenticated = user || localStorage.getItem('token');

  if (!isAuthenticated) {
    toast.error('Please login first');
    return;
  }

  if (userPassword) {
    // Clear session to force lock
    localStorage.removeItem('active_session');
    localStorage.removeItem('last_activity_time');
    
    // Set locked state to true in context
    setIsLocked(true);
    
    // Show success message
    toast.success('Device locked. Please enter your passcode to continue.', {
      duration: 3000,
      icon: '🔒',
    });
    
    // Close any open menus
    setOpenMenu(null);
    setMobileMenuOpen(false);
  } else {
    toast.error('Please set up a local passcode first', {
      duration: 3000,
      icon: '🔐',
    });
    navigate('/password');
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
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-fadeOut { animation: fadeOut 0.3s ease-out; }
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

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                    item.active 
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-700'
                      : `${theme.hover} ${theme.text}`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
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

      {/* Main NavBar - Don't show when locked */}
      {!isLocked && (
        <header className={`fixed top-0 left-0 w-full z-30 ${isDarkMode ? 'bg-gray-900': 'bg-gray-100'} ${theme.border} border-b ${theme.shadow}`}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/aastuLogo.png"
                  alt="AASTU Logo"
                  className="w-12 h-12 rounded-full"
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

              {/* Desktop Icons - Only show if user is logged in */}
              {user && (
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
                      <div className={`absolute right-0 top-12 w-80 ${theme.cardBg} backdrop-blur-lg border ${theme.border} rounded-xl shadow-2xl z-100 animate-fadeIn`}>
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
                      <div className={`absolute right-0 top-12 w-64 ${theme.cardBg} backdrop-blur-lg border ${theme.border} rounded-xl shadow-2xl z-100 animate-fadeIn`}>
                        <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${theme.border}`}>
                          <h3 className={`font-bold ${theme.text}`}>Security</h3>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleLockPage}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} ${theme.text}`}
                          >
                            <FaLock />
                            <span>Lock Screen</span>
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
              )}

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
      )}

      {/* Logout Confirmation Modal - Don't show when locked */}
      {!isLocked && logwarn && (
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
    </>
  );
};

export default NavBar;