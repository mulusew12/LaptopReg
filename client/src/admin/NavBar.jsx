import React, { useState } from 'react';
import {
  FaBell,
  FaLockOpen,
  FaUser,
  FaBars,
  FaLock,
  FaKey
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
  
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

// In NavBar component
const handleLockPage = () => {
  // Get password from localStorage where Password component saved it
  const userPassword = localStorage.getItem('userPassword');
  
  if (userPassword) {
    setIsLocked(true);
    setOpenMenu(null);
    setPasswordInput('');
    setError('');
  } else {
    alert('No password found. Please set a password first.');
    // Optionally navigate to password setup page
    // navigate('/password');
  }
};

const handleUnlock = () => {
  // Compare with localStorage password
  const storedPassword = localStorage.getItem('userPassword');
  
  if (passwordInput === storedPassword) {
    setIsLocked(false);
    setPasswordInput('');
    setError('');
  } else {
    setError('Incorrect password. Please try again.');
    setPasswordInput('');
  }
};
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b p-2 border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/aastuLogo.png"
            alt="AASTU Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="hidden sm:block text-lg font-semibold text-indigo-700">
            AASTU Portal
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* 🔔 Notifications */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('bell')}
              className="border p-3 rounded-md hover:bg-gray-100"
              aria-label="Notifications"
            >
              <FaBell className="text-xl text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {openMenu === 'bell' && (
              <div className="absolute right-0 top-14 w-64 bg-white border rounded-md shadow-lg p-4 text-sm text-gray-700 z-10">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <ul className="space-y-1">
                  <li className="p-2 rounded hover:bg-gray-100">Message 1</li>
                  <li className="p-2 rounded hover:bg-gray-100">Message 2</li>
                  <li className="p-2 rounded hover:bg-gray-100">Message 3</li>
                </ul>
              </div>
            )}
          </div>

          {/* 🔐 Security */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('lock')}
              className="border p-3 rounded-md hover:bg-gray-100"
              aria-label="Security"
            >
              <FaLockOpen className="text-xl text-gray-600" />
            </button>

            {openMenu === 'lock' && (
              <div className="absolute right-0 top-14 w-56 bg-white border rounded-md shadow-lg p-4 text-sm text-gray-700 z-10">
                <h3 className="font-semibold mb-2">Security</h3>
                <ul className="space-y-1">
                  <li 
                    onClick={handleLockPage}
                    className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <FaLock className="text-sm" />
                    Lock page
                  </li>
                  <li onClick={()=>navigate('/password')} className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <FaKey className="text-sm" />
                    Change password
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* 👤 Profile */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('profile')}
              className="border p-3 rounded-md hover:bg-gray-100"
              aria-label="Profile"
            >
              <FaUser className="text-xl text-gray-600" />
            </button>

            {openMenu === 'profile' && (
              <div className="absolute right-0 top-14 w-56 bg-white border rounded-md shadow-lg p-4 text-sm text-gray-700 z-10">
                <h3 className="font-semibold mb-2">Profile</h3>
                <ul className="space-y-1">
                  <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    View profile
                  </li>
                  <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* User + Logout */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu icon */}
          <button className="sm:hidden text-xl text-gray-600">
            <FaBars />
          </button>
        </div>
      </div>

      {/* Lock Screen Overlay */}
      {isLocked && (
        <div className='fixed top-0 left-0 w-full h-full bg-green-950 z-[9999] flex items-center justify-center'>
          <div className='flex flex-col items-center justify-center text-white gap-6 p-8 bg-green-900/50 rounded-lg backdrop-blur-sm'>
            <FaLock className='text-8xl animate-pulse'/>
            <h1 className='text-5xl md:text-6xl font-bold'>LOCKED</h1>
            <p className='text-lg text-center text-gray-300'>
              Enter your password to unlock the page
            </p>
            
            <div className='flex flex-col gap-4 w-full max-w-md'>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className='w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50'
                autoFocus
              />
              
              {error && (
                <p className='text-red-300 text-sm text-center'>{error}</p>
              )}
              
              <div className='flex gap-4'>
                <button 
                  onClick={handleUnlock}
                  className='flex-1 flex gap-3 items-center justify-center border border-white p-3 cursor-pointer rounded-md hover:bg-white/10 transition-colors'
                >
                  <FaKey/>
                  Unlock
                </button>
                
                <button 
                  onClick={() => {
                    setIsLocked(false);
                    setPasswordInput('');
                    setError('');
                    navigate('/password')
                  }}
                  className='px-6 py-3 border border-transparent hover:border-white rounded-md hover:bg-white/5 transition-colors'
                >
                  Forget password?
                </button>
              </div>
            </div>
            
            <div className='mt-4 text-sm text-gray-400'>
              <p>User: {user?.name || user?.email || 'Unknown User'}</p>
              <p className='text-xs mt-1'>Locked at: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;