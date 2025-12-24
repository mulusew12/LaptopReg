import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaArrowRight, FaShieldAlt, FaUser, FaGoogle, FaGithub } from 'react-icons/fa';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser, formData, setFormData, axios } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  // Create floating particles
  useEffect(() => {
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.2 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', response.data);
      
      // Save complete user object
      const userData = {
        email: formData.email,
        isAdmin: true,
        loginTime: new Date().toISOString(),
        name: formData.email.split('@')[0], // Extract name from email
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email.split('@')[0])}&background=6366f1&color=fff`,
      };
      
      setUser(userData);
      
      toast.success('Login successful!');
      setFormData({ email: '', password: '' });
      
      // Show success animation before redirect
    


   

    } catch (error) {
      console.error('Login failed:', error);
      // Error handling
      if (error.response) {
        switch (error.response.status) {
          case 400:
          case 401:
            setErrorMessage('Invalid email or password. Please try again.');
            break;
          case 404:
            setErrorMessage('Service unavailable. Please contact support.');
            break;
          case 500:
            setErrorMessage('Server error. Please try again later.');
            break;
          default:
            setErrorMessage('Login failed. Please try again.');
        }
      } else if (error.request) {
        setErrorMessage('Cannot connect to server. Check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@aastu.edu.et',
      password: 'demo123',
    });
    toast.success('Demo credentials loaded!');
  };

  return (
    <div className=" min-h-screen fixed right-0 bottom-0 left-0 top-0 z-1000  overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center border-b border-white/10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg"
              >
                <FaShieldAlt className="text-white text-3xl" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-300">
                Sign in to your AASTU Portal account
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-8 mt-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-200 text-sm font-medium">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-2">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@aastu.edu.et"
                    required
                    className="relative w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin()}
                    className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    Try Demo Account
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="relative w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  />
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-5 h-5 bg-white/10 border border-white/20 rounded peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-colors flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <button type="button" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "0%" : "-100%" }}
                  transition={{ duration: 0.3 }}
                />
                
                <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>

              {/* Divider */}
            

              {/* Social Login Options */}
             
            </form>

            {/* Footer */}
            <div className= " pt-0 text-center border-t border-white/10">
         
              
              {/* Security Note */}
              <div className=" p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-blue-300">Protected by AASTU Security Protocol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Credentials Card */}
    
        </motion.div>
      </div>

      {/* Add custom scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: white;
        }
      `}</style>
    </div>
  );
};

export default Login;