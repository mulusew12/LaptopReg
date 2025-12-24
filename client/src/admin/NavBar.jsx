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
  FaCheckCircle
} from 'react-icons/fa';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate()
  const { user, logout, form } = useAppContext();
  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLockPage = () => {
    const userPassword = localStorage.getItem('userPassword');
    
    if (userPassword) {
      setIsLocked(true);
      setOpenMenu(null);
      setPasswordInput('');
      setError('');
    } else {
      // Show toast notification instead of alert
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

  return (
    <>
      {/* Add CSS animations to index.css or style tag */}
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
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-fadeOut { animation: fadeOut 0.3s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}
      </style>

      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm border-b border-gray-200/70 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/aastuLogo.png"
                  alt="AASTU Logo"
                  className="w-12 h-12 object-contain drop-shadow-sm"
                />
                <div className="absolute max-md:hidden -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className='max-md:hidden'>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  AASTU Portal
                </h1>
                <p className="text-xs text-gray-500">Laptop Management System</p>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>
            
            {/* User Info - Desktop */}
        
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            
            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('bell')}
                className="relative p-3 rounded-xl bg-white/50 border border-gray-200/70 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                aria-label="Notifications"
              >
                <FaBell className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {openMenu === 'bell' && (
                <div className="absolute right-0 top-16 w-80 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-0 z-10 animate-fadeIn overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white text-lg">Notifications</h3>
                      <span className="text-white/80 text-sm">{notifications.length} total</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors">
                        All
                      </button>
                      <button className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
                        Unread ({unreadNotifications})
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            View details →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                    <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 🔐 Security */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('lock')}
                className="p-3 rounded-xl bg-white/50 border border-gray-200/70 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                aria-label="Security"
              >
                <FaShieldAlt className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>

              {openMenu === 'lock' && (
                <div className="absolute right-0 top-16 w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-0 z-10 animate-fadeIn overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <h3 className="font-bold text-white text-lg">Security</h3>
                    <p className="text-white/80 text-sm">Manage security settings</p>
                  </div>
                  <ul className="py-2">
                    <li 
                      onClick={handleLockPage}
                      className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer flex items-center gap-3 group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaLock className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Lock Page</p>
                        <p className="text-xs text-gray-500">Secure your session</p>
                      </div>
                    </li>
                    <li 
                      onClick={() => navigate('/password')}
                      className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer flex items-center gap-3 group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaKey className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Change Password</p>
                        <p className="text-xs text-gray-500">Update your credentials</p>
                      </div>
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer flex items-center gap-3 group transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaCog className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Security Settings</p>
                        <p className="text-xs text-gray-500">Advanced options</p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* 👤 Profile */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('profile')}
              className="p-3 rounded-xl bg-white/50 border border-gray-200/70 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                aria-label="Profile"
              >
              <FaUser className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                
              </button>

              {openMenu === 'profile' && (
                <div className="absolute right-0 top-16 w-72 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-0 z-10 animate-fadeIn overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{user?.name || 'User Account'}</h3>
                        <p className="text-white/80 text-sm">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <ul className="py-2">
                    <li className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer flex items-center gap-3 group transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <FaEye className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">View Profile</p>
                        <p className="text-xs text-gray-500">Personal information</p>
                      </div>
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer flex items-center gap-3 group transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <FaCog className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Settings</p>
                        <p className="text-xs text-gray-500">Preferences & configuration</p>
                      </div>
                    </li>
                    <div className="border-t border-gray-200 my-2"></div>
                    <li 
                      onClick={logout}
                      className="px-4 py-3 hover:bg-red-50/80 cursor-pointer flex items-center gap-3 group transition-colors text-red-600"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                        <FaSignOutAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Logout</p>
                        <p className="text-xs">End current session</p>
                      </div>
                    </li>
                  </ul>
                  <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-500 text-center">
                      Last login: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button - Desktop */}
            <button
              onClick={logout}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>

            {/* Mobile menu icon */}
            <button className="lg:hidden p-3 rounded-xl bg-white/50 border border-gray-200/70 hover:bg-white hover:shadow-md transition-all">
              <FaBars className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Lock Screen Overlay - Enhanced */}
      {isLocked && (
        <div className='fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-[9999] flex items-center justify-center p-4'>
          <div className='flex flex-col items-center justify-center text-white gap-8 p-8 md:p-12 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl backdrop-blur-xl border border-gray-700/50 shadow-2xl max-w-lg w-full'>
            
            {/* Lock Icon with Animation */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center mb-2 animate-pulse">
                <FaLock className='text-6xl text-white/90'/>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold">!</span>
              </div>
            </div>
            
            {/* Locked Text */}
            <div className="text-center">
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2'>
                LOCKED
              </h1>
              <p className='text-lg text-gray-300 mb-2'>
                Session is secured
              </p>
              <p className='text-gray-400 text-sm'>
                Enter your password to continue
              </p>
            </div>
            
            {/* Password Input */}
            <div className='flex flex-col gap-6 w-full'>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className='w-full p-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all'
                  autoFocus
                />
                <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className='text-red-300 text-sm'>{error}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <button 
                  onClick={handleUnlock}
                  className='flex-1 flex gap-3 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 p-4 cursor-pointer rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group'
                >
                  <FaCheckCircle className="group-hover:scale-110 transition-transform"/>
                  Unlock Session
                </button>
                
                <button 
                  onClick={() => {
                    setIsLocked(false);
                    setPasswordInput('');
                    setError('');
                    navigate('/password')
                  }}
                  className='px-6 py-4 border border-white/30 hover:border-white/50 hover:bg-white/5 rounded-xl transition-colors text-gray-300 hover:text-white'
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            
            {/* User Info */}
            <div className='mt-6 pt-6 border-t border-white/10 w-full'>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                  <span className="font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="text-center">
                <p className='text-xs text-gray-500'>
                  Locked at: <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  Session ID: <code className="text-gray-400">SES-{Date.now().toString(36).toUpperCase()}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;