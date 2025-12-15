import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';

const Login = () => {
  const { setUser, formData, setFormData, axios } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      // ✅ Save complete user object
      const userData = {
        email: formData.email,
        isAdmin: true,
        loginTime: new Date().toISOString(),
        // Add any other user data you might need
      };
      
      setUser(userData);
      toast.success('Login successfully')
      setFormData({ email: '', password: '' });
      // Redirect or show success message
      // Example: window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      // Better error handling
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400 || error.response.status === 401) {
          setErrorMessage(error.response.data.message || error.response.data);
        } else if (error.response.status === 404) {
          setErrorMessage('Endpoint not found. Check backend server.');
        } else {
          setErrorMessage(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // Request made but no response
        console.log('Request was made but no response:', error.request);
        setErrorMessage('Cannot connect to server. Make sure backend is running.');
      } else {
        // Something else happened
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="bg-amber-100 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed flex justify-center items-center'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
