import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaCheck,
  FaTimes,
  FaUserShield,
  FaMobileAlt,
  FaArrowLeft,
  FaKey,
  FaCheckCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUndo,
  FaSpinner
} from 'react-icons/fa';

const Password = () => {
  const { user, axios } = useAppContext();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
    loginEmail: '',
    loginPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('welcome');
  const [isResetting, setIsResetting] = useState(false);
  const [loginVerified, setLoginVerified] = useState(false);
  const navigate = useNavigate();

  // Check existing password on mount
  useEffect(() => {
    const hasPassword = localStorage.getItem('userPassword');
    
    // If user is logged in and has password, go to dashboard
    if (user && hasPassword) {
      const fromForgot = localStorage.getItem('from_forgot_password');
      if (!fromForgot) {
        navigate('/dashboard');
      } else {
        // Clear the flag and show reset option
        localStorage.removeItem('from_forgot_password');
      }
    }
    
    // If no user and no password, go to login
    if (!user && !hasPassword) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  // Handle password verification for reset
  const handleLoginVerification = async (e) => {
    e.preventDefault();
    
    if (!form.loginEmail || !form.loginPassword) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify login credentials
      const response = await axios.post('/api/auth/login', {
        email: form.loginEmail,
        password: form.loginPassword
      });

      if (response.data) {
        toast.success('Login verified successfully');
        setLoginVerified(true);
        // Store verified email for user context
        localStorage.setItem('verifiedEmail', form.loginEmail);
        // Move to create new password step
        setStep('create');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login verification error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (error.response?.status === 400) {
        setError('Invalid credentials format.');
      } else if (error.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('Failed to verify credentials. Please try again.');
      }
      toast.error('Login verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative local verification (if backend not available)
  const handleLocalVerification = async (e) => {
    e.preventDefault();
    
    if (!form.loginEmail || !form.loginPassword) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if we have stored login data (this should be set during login)
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (storedUser.email === form.loginEmail) {
        // For local verification, we need to store the login password hash
        // This should be done in your Login component after successful login
        const loginHash = localStorage.getItem('loginPasswordHash');
        
        if (loginHash) {
          // Simple hash comparison (use proper hashing in production)
          const inputHash = btoa(form.loginPassword); // Don't use in production
          
          if (inputHash === loginHash) {
            toast.success('Login verified successfully');
            setLoginVerified(true);
            localStorage.setItem('verifiedEmail', form.loginEmail);
            setStep('create');
          } else {
            throw new Error('Invalid password');
          }
        } else {
          // If no hash stored, we can't verify locally
          throw new Error('Please login again to reset local password');
        }
      } else {
        throw new Error('Invalid email');
      }
    } catch (error) {
      setError(error.message || 'Verification failed');
      toast.error('Login verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeContinue = () => {
    setStep('create');
  };

  // Start password reset process
  const handleStartReset = () => {
    setIsResetting(true);
    setStep('verify');
    setForm(prev => ({ ...prev, loginEmail: user?.email || '' }));
  };

  const handleCreatePassword = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword(form.password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPassword = async (e) => {
    e.preventDefault();
    
    if (!form.confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save new local password
      localStorage.setItem('userPassword', form.password);
      localStorage.setItem('password_setup_complete', 'true');
      
      if (isResetting) {
        toast.success('Local password reset successfully!');
        
        // Clear reset flags
        localStorage.removeItem('from_forgot_password');
        localStorage.removeItem('just_setup_password');
      } else {
        localStorage.setItem('just_setup_password', 'true');
        toast.success('Local password created successfully!');
      }
      
      // Set up session for auto-lock
      localStorage.setItem('active_session', 'true');
      localStorage.setItem('last_activity_time', Date.now().toString());
      
      setTimeout(() => {
        setStep('success');
      }, 500);
      
    } catch (error) {
      setError('Failed to save password');
      toast.error('Failed to save password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    // Clear setup flags
    localStorage.removeItem('just_setup_password');
    localStorage.removeItem('from_forgot_password');
    
    // Navigate to dashboard (will show lock screen)
    navigate('/dashboard');
  };

  const handleCancelReset = () => {
    setIsResetting(false);
    setLoginVerified(false);
    setForm(prev => ({ ...prev, loginEmail: '', loginPassword: '' }));
    setStep('welcome');
    toast.success('Reset cancelled');
  };

  const goBack = () => {
    if (step === 'confirm') {
      setStep('create');
    } else if (step === 'create') {
      if (isResetting) {
        setStep('verify');
      } else {
        setStep('welcome');
      }
    } else if (step === 'verify') {
      setStep('welcome');
      setIsResetting(false);
    }
  };

  // Render login verification step
  const renderVerificationStep = () => (
    <form onSubmit={handleLoginVerification} className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 rounded-full relative">
          <FaShieldAlt className="w-12 h-12 text-white" />
          <div className="absolute inset-0 border-4 border-orange-400/30 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Identity
        </h2>
        <p className="text-gray-600">Enter your login credentials to reset local password</p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            <strong>Security Notice:</strong> You must verify your login password to reset the local password.
            Without login credentials, you cannot reset the local password.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FaEnvelope className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="loginEmail"
              value={form.loginEmail}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all hover:border-red-400"
              placeholder="Enter your login email"
              autoFocus
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Login Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FaSignInAlt className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showLoginPassword ? 'text' : 'password'}
              name="loginPassword"
              value={form.loginPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all hover:border-red-400"
              placeholder="Enter your login password"
              required
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showLoginPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is the password you use to log into the application
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
          <p className="text-sm text-red-600 flex items-center">
            <FaTimes className="w-4 h-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={handleCancelReset}
          className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-all"
        >
          <FaArrowLeft />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify & Continue'
          )}
        </button>
      </div>
    </form>
  );

  const renderStep = () => {
    // Show verification step for reset
    if (step === 'verify' && isResetting) {
      return renderVerificationStep();
    }

    switch (step) {
      case 'welcome':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-xl relative">
                <FaUserShield className="w-14 h-14 text-white" />
                <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {user ? 'Device Security Setup' : 'Local Password Access'}
              </h2>
              <p className="text-gray-600 text-lg">
                {user 
                  ? "Create a local password for quick access on this device"
                  : "Access your locally stored password"
                }
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaLock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Local Device Protection</h4>
                  <p className="text-gray-600">
                    Your password is stored only on this device and never leaves it.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FaMobileAlt className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Auto-Lock Feature</h4>
                  <p className="text-gray-600">
                    The app will automatically lock after 5 minutes of inactivity.
                  </p>
                </div>
              </div>

              {/* Reset option for existing users */}
              {user && localStorage.getItem('userPassword') && (
                <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-100 mt-6">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FaUndo className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Reset Local Password</h4>
                    <p className="text-gray-600 mb-3">
                      Forgot your local password? Reset it by verifying your login credentials.
                    </p>
                    <button
                      onClick={handleStartReset}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
             <button
                 onClick={handleStartReset}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5"
              >
                {user ? 'Reset Local Password' : 'Access Device'}
              </button> 
              
              {!user && (
                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Back to Login
                </button>
              )}
            </div>
          </div>
        );

      case 'create':
        return (
          <form onSubmit={handleCreatePassword} className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative">
                <FaLock className="w-12 h-12 text-white" />
                <div className="absolute inset-0 border-4 border-green-400/30 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isResetting ? 'Create New Password' : 'Create Local Password'}
              </h2>
              <p className="text-gray-600">
                {isResetting 
                  ? 'Create a new local password for your device'
                  : 'Create a secure password for local access'
                }
              </p>
              {isResetting && loginVerified && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Login verified successfully. You can now create a new password.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaKey className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all hover:border-blue-400"
                    placeholder="Enter a strong password"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`flex items-center ${form.password?.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                  {form.password?.length >= 6 ? 
                    <FaCheckCircle className="w-5 h-5 mr-2 text-green-500" /> : 
                    <div className="w-5 h-5 mr-2 border-2 border-gray-300 rounded-full" />
                  }
                  <span className="text-sm font-medium">At least 6 characters</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
                <p className="text-sm text-red-600 flex items-center">
                  <FaTimes className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaArrowLeft />
                Back
              </button>
              <button
                type="submit"
                disabled={!form.password}
                className="flex-1 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </form>
        );

      case 'confirm':
        return (
          <form onSubmit={handleConfirmPassword} className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-full relative">
                <FaShieldAlt className="w-12 h-12 text-white" />
                <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Password
              </h2>
              <p className="text-gray-600">Re-enter your password to confirm</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FaShieldAlt className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all hover:border-blue-400"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className={`flex items-center ${form.password && form.confirmPassword && form.password === form.confirmPassword ? 'text-green-600' : 'text-gray-500'}`}>
                {form.password && form.confirmPassword && form.password === form.confirmPassword ? 
                  <FaCheckCircle className="w-5 h-5 mr-2 text-green-500" /> : 
                  <div className="w-5 h-5 mr-2 border-2 border-gray-300 rounded-full" />
                }
                <span className="text-sm font-medium">Passwords match</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
                <p className="text-sm text-red-600 flex items-center">
                  <FaTimes className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaArrowLeft />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </div>
                ) : (
                  isResetting ? 'Reset Password' : 'Complete Setup'
                )}
              </button>
            </div>
          </form>
        );

      case 'success':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl relative">
                <FaShieldAlt className="w-14 h-14 text-white" />
                <div className="absolute inset-0 border-4 border-pink-400/30 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isResetting ? 'Password Reset Complete!' : 'Setup Complete!'} 🎉
              </h2>
              <p className="text-gray-600 text-lg">
                {isResetting 
                  ? 'Your local password has been successfully reset'
                  : 'Your device is now protected with local security'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {isResetting ? 'Password Updated' : 'Next Step'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isResetting
                        ? 'Your new local password is now active. You will need to enter it to unlock the app.'
                        : "You'll be asked to enter your password to unlock the app. After that, the app will remember you for a while."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoToDashboard}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5"
              >
                Continue to App
              </button>
              
              {!isResetting && (
                <button
                  onClick={handleStartReset}
                  className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium hover:underline"
                >
                  Need to reset password later?
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {(isResetting && step === 'verify') ? (
              // Custom progress for reset flow
              <>
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-red-500 bg-red-500 text-white shadow-lg font-semibold">
                  1
                </div>
                <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  ['create', 'confirm', 'success'].includes(step) 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300 bg-white text-gray-400'
                } font-semibold`}>
                  2
                </div>
                <div className={`w-12 h-1.5 rounded-full ${
                  ['confirm', 'success'].includes(step) 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                }`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step === 'confirm' 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : step === 'success'
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                } font-semibold`}>
                  3
                </div>
                <div className={`w-12 h-1.5 rounded-full ${
                  step === 'success' 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step === 'success' 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-300 bg-white text-gray-400'
                } font-semibold`}>
                  4
                </div>
              </>
            ) : (
              // Normal progress
              ['welcome', 'create', 'confirm', 'success'].map((s, index) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step === s 
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                      : ['welcome', 'create', 'confirm', 'success'].indexOf(step) > index 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  } font-semibold transition-all duration-300`}>
                    {['welcome', 'create', 'confirm', 'success'].indexOf(step) > index ? (
                      <FaCheck className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1.5 rounded-full ${
                      ['welcome', 'create', 'confirm', 'success'].indexOf(step) > index 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    } transition-all duration-300`} />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {user ? (
              <>
                {isResetting ? 'Resetting password for: ' : 'Setting up device for: '}
                <span className="font-semibold text-gray-700">{user.email}</span>
              </>
            ) : (
              <>Local device access</>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            🔐 {isResetting 
              ? 'Login verification required for security' 
              : 'Password stored locally on this device only'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Password;