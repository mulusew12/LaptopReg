import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEnvelope, FaLock, FaUser, FaIdCard, FaEye, FaEyeSlash, FaExpand, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for loading state
import { useAppContext } from '../auth/Context';

const Login = () => {
  const {setUser, formData, setFormData} = useAppContext()

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // NEW STATE: To prevent repeated data submission and show loading
  const [isLoading, setIsLoading] = useState(false); 
  // NEW STATE: To control the visibility of the floating info box (optional)
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser(formData.fullName)
    if (isLoading) return; // Prevent submission if already loading

    setIsLoading(true); // Start loading state

    console.log('Login attempt with:', formData);

    try {
      // Simulate an API call delay (Replace with actual fetch/axios call)
      await new Promise(resolve => setTimeout(resolve, 2000)); 
       formData.fullName=''
       formData.email =''
       formData.password=''
       formData.userId =''
      // On successful login:
      console.log('Login Successful!');
      // Navigate user or store token here

    } catch (error) {
      // On error:
      console.error('Login Failed:', error);
      // Display error message to the user

    } finally {
      // Re-enable the button regardless of success or failure
      setIsLoading(false); 
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Add social login logic
  };

  return (
    // Main centering container
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4 max-md:p-0">
      {/* Login Card */}
      <div className="bg-amber-100 p-10 md:p-12 lg:p-16 rounded-sm shadow-2xl w-full max-w-lg  ">
        
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Sign In to Your Account
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name (Optional for Login, but kept as per original structure) */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaUser className="mr-2 text-purple-600" />
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="John Doe"
                required
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaIdCard className="mr-2 text-purple-600" />
              User ID
            </label>
            <div className="relative">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="user_12345"
                required
              />
              <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaEnvelope className="mr-2 text-purple-600" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="john@example.com"
                required
              />
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaLock className="mr-2 text-purple-600" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="••••••••"
                required
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors duration-150 ${rememberMe ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={isLoading} // IMPORTANT: Disable the button while loading
            className={`w-full text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 transform shadow-lg hover:shadow-xl ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed flex justify-center items-center' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              'Sign In'
            )}
          </button>
          
          {/* Social Login Section (Added for completeness) */}
          <div className="flex items-center space-x-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">Or sign in with</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex space-x-4 justify-center">
            <button 
              type="button" 
              onClick={() => handleSocialLogin('Google')} 
              className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Sign in with Google"
            >
              <FcGoogle className="w-6 h-6" />
            </button>
            <button 
              type="button" 
              onClick={() => handleSocialLogin('Github')} 
              className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Sign in with GitHub"
            >
              <FaGithub className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </form>
      </div>

      {/* Floating Info Box (Responsive adjustments) */}
      {/* Used 'hover:block' on the button and 'opacity' on the note for smoother transition */}
      <div className='fixed right-0 top-20 max-w-sm sm:max-w-md'>
        {/* Toggle button for small screens */}
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className='p-3 bg-purple-600 text-white rounded-l-2xl shadow-xl md:hidden'
          aria-label="Toggle information"
        >
          <FaExpand className={`transform transition-transform duration-300 ${showInfo ? 'rotate-180' : 'rotate-0'}`}/>
        </button>

        {/* Info box content: visible on large screens or when toggled on small screens */}
        <div 
          className={`
            bg-purple-100 border border-purple-300 p-4 rounded-l-2xl shadow-xl transition-all duration-300 ease-in-out
            ${showInfo ? 'block opacity-100 translate-x-0' : 'hidden md:block opacity-0 md:opacity-100 md:translate-x-0'} 
            md:translate-x-0
          `}
          // The max-w-xl was causing overflow, reduced it to a fixed size for better control.
          style={{ width: '250px' }} 
        >
          <span className='text-lg font-bold text-purple-800 block mb-1'>Note!</span>
          <p className='text-sm text-purple-700'>You must log in using your official **University Name** and **Student ID** (User ID) for access.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;