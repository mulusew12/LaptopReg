import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner, FaEnvelope, FaLock } from 'react-icons/fa';

const Password = () => {
  const { form, setForm, user, setUser, axios, formData, setFormData } = useAppContext();
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetCredentials, setResetCredentials] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Check if user already has a local password stored
  const checkExistingPassword = () => {
    const savedPassword = localStorage.getItem('userPassword');
    return !!savedPassword;
  };

  // Initialize on component mount
  useEffect(() => {
    const hasPassword = checkExistingPassword();
    setHasExistingPassword(hasPassword);
    
    // If no user is logged in and no local password, redirect to login
    if (!user && !hasPassword) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (isResetting) {
      setResetCredentials(prev => ({ ...prev, [name]: value }));
    } else if (hasExistingPassword) {
      setEnteredPassword(value);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isResetting) {
        // Verify admin credentials before allowing password reset
        await handleResetPassword();
      } else if (hasExistingPassword) {
        // Verify existing local password
        await handlePasswordVerification();
      } else {
        // Create new local password
        await handleCreatePassword();
      }
    } catch (error) {
      console.error('Password operation failed:', error);
      setError(error.message || 'Operation failed');
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordVerification = async () => {
    if (!enteredPassword) {
      throw new Error('Please enter your password');
    }

    const storedPassword = localStorage.getItem('userPassword');
    
    if (enteredPassword === storedPassword) {
      toast.success('Access granted!');
      setEnteredPassword('');
      
      // Navigate to dashboard
      navigate('/');
    } else {
      throw new Error('Incorrect password. Please try again.');
    }
  };

  const handleCreatePassword = () => {
    if (!form.password) {
      throw new Error('Password is required');
    }

    if (form.password !== form.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (form.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Save the local password to localStorage
    localStorage.setItem('userPassword', form.password);
    
    toast.success('Local password created successfully');
    setForm({ password: '', confirmPassword: '' });
    setHasExistingPassword(true);
    
    // Navigate to dashboard after creating password
    navigate('/dashboard');
  };

  const handleResetPassword = async () => {
    // Validate reset credentials
    if (!resetCredentials.email || !resetCredentials.password) {
      throw new Error('Please enter both email and password');
    }

    try {
      // Use the same login endpoint for verification
      const response = await axios.post('/api/auth/login', {
        email: resetCredentials.email,
        password: resetCredentials.password,
      });

      if (response.data) {
        // Login successful, clear local password
        localStorage.removeItem('userPassword');
        
        // Set user in context
        const userData = {
          email: resetCredentials.email,
          isAdmin: true,
          loginTime: new Date().toISOString(),
        };
        setUser(userData);
        
        toast.success('Local password reset successful. Please create a new password.');
        setHasExistingPassword(false);
        setIsResetting(false);
        setResetCredentials({ email: '', password: '' });
        setForm({ password: '', confirmPassword: '' });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid credentials');
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check your connection.');
      }
      throw new Error('Failed to verify credentials');
    }
  };

  const initiateReset = () => {
    setIsResetting(true);
    setError('');
    setEnteredPassword('');
  };

  const cancelReset = () => {
    setIsResetting(false);
    setResetCredentials({ email: '', password: '' });
    setError('');
  };

  const renderResetForm = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Reset Local Password
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter your login credentials to reset the local password
        </p>
      </div>

      <div className="relative">
        <input
          type="email"
          name="email"
          value={resetCredentials.email}
          onChange={handleChange}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your email"
          required
        />
        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name="password"
          value={resetCredentials.password}
          onChange={handleChange}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your login password"
          required
        />
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Verify & Reset'}
        </button>
        <button
          type="button"
          onClick={cancelReset}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderPasswordForm = () => {
    if (hasExistingPassword && !isResetting) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Local Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={enteredPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your local password"
                autoComplete="current-password"
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is the local password you created for this device
            </p>
          </div>

          <button
            type="button"
            onClick={initiateReset}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Forgot local password? Reset with login credentials
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 ">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create Local Password
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Create a local password for this device. You'll need this password to access the application on this device.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Local Password
          </label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a local password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type={show ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1 font-medium">Password Requirements:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className={`flex items-center ${form.password?.length >= 6 ? 'text-green-600' : ''}`}>
              <svg className={`w-3 h-3 mr-2 ${form.password?.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              At least 6 characters long
            </li>
            <li className={`flex items-center ${form.password && form.confirmPassword && form.password === form.confirmPassword ? 'text-green-600' : ''}`}>
              <svg className={`w-3 h-3 mr-2 ${form.password && form.confirmPassword && form.password === form.confirmPassword ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              Passwords match
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Don't show password page if user is not logged in
  if (!user && !isResetting) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to log in first to access the password page
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isResetting ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            ) : hasExistingPassword ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isResetting ? 'Reset Password' : hasExistingPassword ? 'Local Access' : 'Setup Local Access'}
          </h1>
          <p className="text-gray-600">
            {isResetting 
              ? 'Enter your login credentials to reset local password'
              : hasExistingPassword 
                ? 'Enter your local password for this device'
                : 'Create a local password for this device'
            }
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isResetting ? renderResetForm() : renderPasswordForm()}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Show Password Toggle */}
            {!isResetting && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={show}
                  onChange={() => setShow(!show)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                  Show password
                </label>
              </div>
            )}

            {/* Submit Button */}
            {!isResetting && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : hasExistingPassword ? (
                  'Unlock'
                ) : (
                  'Create Password'
                )}
              </button>
            )}
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {isResetting
                ? 'This will reset your local password. You can create a new one after verification.'
                : 'This password is stored locally on this device for quick access.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;