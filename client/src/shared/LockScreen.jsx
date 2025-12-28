import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (attempts >= 3) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [attempts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (timeLeft > 0) {
      toast.error(`Please wait ${timeLeft} seconds before trying again`);
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const savedPassword = localStorage.getItem('userPassword');
      
      if (password === savedPassword) {
        toast.success('Access granted!');
        setPassword('');
        setAttempts(0);
        if (onUnlock) {
          onUnlock();
        }
      } else {
        setAttempts(prev => prev + 1);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        
        if (attempts + 1 >= 3) {
          toast.error('Too many attempts. Account locked for 30 seconds.');
        } else {
          toast.error(`Incorrect password. ${3 - (attempts + 1)} attempts left`);
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const handleForgotPassword = () => {
    // Clear ALL lock-related storage
    localStorage.removeItem('active_session');
    localStorage.removeItem('last_activity_time');
    localStorage.removeItem('just_setup_password');
    
    // Set a flag to indicate we're coming from forgot password
    localStorage.setItem('from_forgot_password', 'true');
    
    // Clear any lock state in the URL
    window.history.replaceState({}, '', '/password');
    
    // Force reload to reset the app state
    window.location.href = '/password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex flex-col items-center justify-center p-4">
      {/* Blurred background effect */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/20"></div>
      
      {/* Lock screen content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl relative">
            <FaLock className="w-14 h-14 text-white" />
            {/* Animated ring */}
            <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Device Locked
          </h1>
          <p className="text-gray-300 text-lg">Enter your local passcode to continue</p>
        </div>

        {/* Lock screen card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <FaShieldAlt className="w-7 h-7 text-purple-300 mr-3 animate-pulse" />
            <span className="text-gray-200 text-lg font-medium">Local Device Protection</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password input */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <FaLock className="w-6 h-6 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (timeLeft === 0) setAttempts(0);
                }}
                className={`w-full pl-14 pr-14 py-4 bg-white/10 border-2 ${
                  shake ? 'border-red-500 animate-shake' : 'border-white/20 hover:border-purple-400/50'
                } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xl transition-all ${
                  timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="Enter passcode"
                disabled={timeLeft > 0}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={timeLeft > 0}
              >
                {showPassword ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
              </button>
            </div>

            {/* Attempts counter */}
            {attempts > 0 && (
              <div className="text-center">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                  attempts >= 3 ? 'bg-red-500/20' : 'bg-yellow-500/20'
                }`}>
                  {attempts >= 3 ? (
                    <FaExclamationTriangle className="w-5 h-5 text-red-300" />
                  ) : (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                  <p className={`text-sm font-medium ${attempts >= 3 ? 'text-red-300' : 'text-yellow-300'}`}>
                    {attempts >= 3 ? (
                      <>Account locked. Try again in {timeLeft}s</>
                    ) : (
                      <>Incorrect passcode ({attempts}/3 attempts)</>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || timeLeft > 0}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FaLock className="w-5 h-5" />
                    Unlock Device
                  </>
                )}
              </span>
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* Forgot password */}
            <div className="text-center pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-purple-300 hover:text-white text-sm font-medium hover:underline transition-colors inline-flex items-center gap-2 group"
              >
                <FaKey className="w-4 h-4 group-hover:animate-pulse" />
                Forgot passcode? Reset here
              </button>
            </div>
          </form>
        </div>

        {/* Security info */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center space-x-3 text-gray-400 text-sm bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Local Security • Auto-lock enabled</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-500 text-sm">
          🔒 Your data is protected locally • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Add shake animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default LockScreen;