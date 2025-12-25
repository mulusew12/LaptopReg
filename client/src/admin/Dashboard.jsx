import React, { useState, useMemo, useEffect } from 'react'
import { useAppContext } from '../auth/Context'
import { useNavigate } from 'react-router-dom'
import { FaLaptop } from 'react-icons/fa'

const Dashboard = () => {
  const { lists, isDarkMode, setIsDarkMode } = useAppContext()
  const [selected, setSelected] = useState("")
 // Default to dark mode
  const navigate = useNavigate()
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboardTheme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
  }, [])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('dashboardTheme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const unverified = useMemo(() => {
    return lists.filter(list => list.verified === false)
  }, [lists])

  const verifiedCount = lists.length - unverified.length
  const verificationPercentage = lists.length > 0 ? Math.round((verifiedCount / lists.length) * 100) : 0

  // Theme-based colors
  const theme = {
    // Background colors
    bgPrimary: isDarkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
    bgSecondary: isDarkMode ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' : 'bg-gradient-to-br from-white/80 to-gray-50/80',
    bgCard: isDarkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-br from-white to-gray-50',
    
    // Text colors
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textAccent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    
    // Border colors
    borderPrimary: isDarkMode ? 'border-gray-800/50' : 'border-gray-300/50',
    borderSecondary: isDarkMode ? 'border-gray-700/50' : 'border-gray-400/50',
    borderHover: isDarkMode ? 'border-gray-600/70' : 'border-gray-500/70',
    
    // Button colors
    btnPrimary: isDarkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-blue-500 to-blue-600',
    btnPrimaryHover: isDarkMode ? 'hover:from-blue-700 hover:to-cyan-700' : 'hover:from-blue-600 hover:to-blue-700',
    btnSecondary: isDarkMode ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-r from-gray-100 to-gray-200',
    btnSecondaryHover: isDarkMode ? 'hover:from-gray-700/50 hover:to-gray-800/50' : 'hover:from-gray-200 hover:to-gray-300',
    
    // Status colors
    pendingBg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100',
    pendingText: isDarkMode ? 'text-amber-300' : 'text-amber-700',
    pendingBorder: isDarkMode ? 'border-amber-500/20' : 'border-amber-400/50',
    verifiedBg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100',
    verifiedText: isDarkMode ? 'text-emerald-300' : 'text-emerald-700',
    verifiedBorder: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-400/50',
    
    // Gradient accents
    gradientBlue: isDarkMode ? 'from-blue-500 to-cyan-400' : 'from-blue-400 to-blue-500',
    gradientAmber: isDarkMode ? 'from-amber-500 to-orange-400' : 'from-amber-400 to-amber-500',
    gradientEmerald: isDarkMode ? 'from-emerald-500 to-green-400' : 'from-emerald-400 to-emerald-500',
  }

  return (
    <div className={`min-h-screen ${theme.bgPrimary} p-4  pt-24 transition-colors duration-300`}>
      {/* Theme Toggle Button */}
    

      {/* Animated background particles */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${theme.textPrimary} mb-2 transition-colors duration-300`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-blue-400 via-cyan-300 to-blue-500' : 'from-blue-600 via-blue-500 to-blue-700'}`}>
                  Laptop Management
                </span>
              </h1>
              <p className={`${theme.textSecondary} text-lg transition-colors duration-300`}>
                Streamlined registration & verification system
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className={`${theme.bgSecondary} backdrop-blur-lg border ${theme.borderPrimary} rounded-2xl px-5 py-3 transition-all duration-300`}>
                <div className={`text-2xl font-bold ${theme.textPrimary} transition-colors duration-300`}>
                  {lists.length}
                </div>
                <div className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                  Total Devices
                </div>
              </div>
              <div className={`${theme.bgSecondary} backdrop-blur-lg border ${theme.borderPrimary} rounded-2xl px-5 py-3 transition-all duration-300`}>
                <div className={`text-2xl font-bold ${theme.textPrimary} transition-colors duration-300`}>
                  {unverified.length}
                </div>
                <div className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT MENU - Glass Morphism Design */}
          <div className="lg:w-1/4 space-y-6">
            {/* Main Action Card */}
            <div className={`${theme.bgSecondary} backdrop-blur-xl border ${theme.borderPrimary} rounded-3xl overflow-hidden transition-all duration-300 hover:border-${isDarkMode ? 'gray-700/70' : 'gray-400/70'}`}>
              <div className={`p-6 border-b ${theme.borderPrimary}`}>
                <h2 className={`text-xl font-bold ${theme.textPrimary} flex items-center transition-colors duration-300`}>
                  <div className={`w-2 h-8 bg-gradient-to-b ${theme.gradientBlue} rounded-full mr-3`}></div>
                  Quick Actions
                </h2>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Register Button */}
                <button
                  onClick={() => navigate('/register')}
                  className={`group relative w-full text-left ${theme.btnSecondary} ${theme.btnSecondaryHover} border ${theme.borderSecondary} cursor-pointer p-4 rounded-xl transition-all duration-200 backdrop-blur-sm overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-blue-500/0 via-blue-500/5 to-blue-500/0' : 'from-blue-500/0 via-blue-500/10 to-blue-500/0'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-br ${isDarkMode ? 'from-blue-500/20 to-cyan-500/20' : 'from-blue-100 to-blue-200'} p-3 rounded-lg border ${isDarkMode ? 'border-blue-500/30' : 'border-blue-300'}`}>
                        <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <span className={`font-bold ${theme.textPrimary} block transition-colors duration-300`}>
                          Register Device
                        </span>
                        <span className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                          Add new laptop
                        </span>
                      </div>
                    </div>
                    <div className={`${theme.textSecondary} group-hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Unverified Button */}
                <button
                  onClick={() => setSelected('new')}
                  className={`group relative w-full text-left ${theme.btnSecondary} ${theme.btnSecondaryHover} border ${theme.borderSecondary} cursor-pointer p-4 rounded-xl transition-all duration-200 backdrop-blur-sm overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-amber-500/0 via-amber-500/5 to-amber-500/0' : 'from-amber-500/0 via-amber-500/10 to-amber-500/0'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-br ${isDarkMode ? 'from-amber-500/20 to-orange-500/20' : 'from-amber-100 to-amber-200'} p-3 rounded-lg border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-300'}`}>
                        <svg className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <span className={`font-bold ${theme.textPrimary} block transition-colors duration-300`}>
                          Pending Review
                        </span>
                        <span className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                          Awaiting verification
                        </span>
                      </div>
                    </div>
                    {unverified.length > 0 && (
                      <span className={`bg-gradient-to-br ${isDarkMode ? 'from-amber-500/20 to-orange-500/20' : 'from-amber-100 to-amber-200'} ${theme.pendingText} text-sm font-bold px-3 py-1 rounded-full border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-300'}`}>
                        {unverified.length}
                      </span>
                    )}
                  </div>
                </button>

                {/* All Devices Button */}
                <button
                  onClick={() => navigate('/list')}
                  className={`group relative w-full text-left ${theme.btnSecondary} ${theme.btnSecondaryHover} border ${theme.borderSecondary} cursor-pointer p-4 rounded-xl transition-all duration-200 backdrop-blur-sm overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0' : 'from-emerald-500/0 via-emerald-500/10 to-emerald-500/0'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-br ${isDarkMode ? 'from-emerald-500/20 to-green-500/20' : 'from-emerald-100 to-emerald-200'} p-3 rounded-lg border ${isDarkMode ? 'border-emerald-500/30' : 'border-emerald-300'}`}>
                        <svg className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <span className={`font-bold ${theme.textPrimary} block transition-colors duration-300`}>
                          All Devices
                        </span>
                        <span className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                          Complete list
                        </span>
                      </div>
                    </div>
                    <div className={`${theme.textSecondary} group-hover:${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} transition-colors duration-300`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Verification Progress */}
            <div className={`${theme.bgSecondary} backdrop-blur-xl border ${theme.borderPrimary} rounded-3xl p-6`}>
              <h3 className={`${theme.textPrimary} font-bold text-lg mb-6 flex items-center transition-colors duration-300`}>
                <div className={`w-2 h-8 bg-gradient-to-b ${theme.gradientBlue} rounded-full mr-3`}></div>
                Verification Progress
              </h3>
              
              <div className="space-y-6">
                {/* Progress Circle */}
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className={isDarkMode ? "text-gray-800" : "text-gray-300"}
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${verificationPercentage * 3.51} 351`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} />
                        <stop offset="100%" stopColor={isDarkMode ? "#06b6d4" : "#0891b2"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${theme.textPrimary} transition-colors duration-300`}>
                      {verificationPercentage}%
                    </span>
                    <span className={`text-sm ${theme.textSecondary} transition-colors duration-300`}>
                      Verified
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-xl ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200'} transition-colors duration-300`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 bg-gradient-to-r ${theme.gradientBlue} rounded-full mr-3`}></div>
                      <span className={theme.textSecondary}>Total Devices</span>
                    </div>
                    <span className={`font-bold ${theme.textPrimary}`}>{lists.length}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 ${theme.pendingBg} rounded-xl ${isDarkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-200'} transition-colors duration-300`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 bg-gradient-to-r ${theme.gradientAmber} rounded-full mr-3`}></div>
                      <span className={theme.textSecondary}>Pending Review</span>
                    </div>
                    <span className={`font-bold ${theme.pendingText}`}>{unverified.length}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 ${theme.verifiedBg} rounded-xl ${isDarkMode ? 'hover:bg-emerald-500/20' : 'hover:bg-emerald-200'} transition-colors duration-300`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 bg-gradient-to-r ${theme.gradientEmerald} rounded-full mr-3`}></div>
                      <span className={theme.textSecondary}>Verified</span>
                    </div>
                    <span className={`font-bold ${theme.verifiedText}`}>{verifiedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:w-3/4">
            <div className={`${theme.bgSecondary} backdrop-blur-xl border ${theme.borderPrimary} rounded-3xl overflow-hidden transition-all duration-300`}>
              {/* Header */}
              <div className={`p-6 border-b ${theme.borderPrimary}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${theme.textPrimary} transition-colors duration-300`}>
                      {selected === "new" ? "Pending Verifications" : "Dashboard Overview"}
                    </h2>
                    <p className={`${theme.textSecondary} mt-1 transition-colors duration-300`}>
                      {selected === "new" 
                        ? `${unverified.length} devices awaiting review` 
                        : "Monitor and manage device registrations"}
                    </p>
                  </div>
                  
                  {selected === "new" && unverified.length > 0 && (
                    <div className={`${theme.pendingBg} border ${theme.pendingBorder} px-4 py-2 rounded-xl`}>
                      <span className={`${theme.pendingText} font-medium flex items-center transition-colors duration-300`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Action Required
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* DEFAULT VIEW - Empty State */}
              {!selected && (
                <div className="text-center py-6 px-4">
                  <div className={`inline-flex items-center justify-center w-24 h-24 ${theme.bgSecondary} border ${theme.borderPrimary} rounded-3xl mb-8 backdrop-blur-sm transition-all duration-300`}>
                   <FaLaptop className={isDarkMode? 'text-blue-600 text-5xl' : 'text-black text-5xl'}/>
                  </div>
                  <h3 className={`text-2xl font-bold ${theme.textPrimary} mb-4 transition-colors duration-300`}>
                    Welcome to Device Management
                  </h3>
                  <p className={`${theme.textSecondary} max-w-lg mx-auto text-lg mb-8 transition-colors duration-300`}>
                    Centralized platform for laptop registration, verification, and tracking. 
                    Start by registering a new device or reviewing pending verifications.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => navigate('/register')}
                      className={`group px-6 py-3 ${theme.btnPrimary} ${theme.btnPrimaryHover} text-white rounded-xl font-medium transition-all duration-300 ${isDarkMode ? 'shadow-lg hover:shadow-blue-500/25' : 'shadow-md hover:shadow-lg'} relative overflow-hidden`}
                    >
                      <span className="relative z-10">Register New Device</span>
                      <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-blue-500/0 via-white/10 to-blue-500/0' : 'from-blue-500/0 via-white/20 to-blue-500/0'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                    </button>
                    <button
                      onClick={() => setSelected('new')}
                      className={`px-6 py-3 border ${theme.borderSecondary} ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'} ${theme.textSecondary} hover:${theme.textPrimary} rounded-xl font-medium transition-all duration-300`}
                    >
                      Review Pending
                    </button>
                  </div>
                </div>
              )}

              {/* PENDING VERIFICATIONS VIEW */}
              {selected === "new" && (
                <div className="p-6">
                  {unverified.length === 0 ? (
                    <div className={`text-center py-16 border-2 border-dashed ${theme.borderPrimary} rounded-3xl ${theme.bgSecondary} transition-all duration-300`}>
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.verifiedBg} border ${theme.verifiedBorder} rounded-full mb-6 backdrop-blur-sm`}>
                        <svg className={`w-10 h-10 ${theme.verifiedText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className={`text-xl font-bold ${theme.textPrimary} mb-3 transition-colors duration-300`}>
                        All Devices Verified!
                      </h3>
                      <p className={`${theme.textSecondary} max-w-md mx-auto mb-8 transition-colors duration-300`}>
                        No pending verifications. All devices have been successfully verified.
                      </p>
                      <button
                        onClick={() => navigate('/register')}
                        className={`px-5 py-2.5 ${theme.btnPrimary} ${theme.btnPrimaryHover} text-white rounded-xl font-medium transition-all duration-300 ${isDarkMode ? 'shadow-lg hover:shadow-blue-500/25' : 'shadow-md hover:shadow-lg'}`}
                      >
                        Add New Device
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {unverified.map((list, index) => (
                        <div
                          key={index}
                          className={`group relative ${theme.bgCard} border ${theme.borderPrimary} rounded-2xl p-5 hover:border-${isDarkMode ? 'amber-500/50' : 'amber-400'} ${isDarkMode ? 'hover:shadow-2xl hover:shadow-amber-500/10' : 'hover:shadow-xl hover:shadow-amber-500/20'} transition-all duration-300 backdrop-blur-sm overflow-hidden`}
                        >
                          {/* Hover effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-amber-500/0 via-amber-500/5 to-amber-500/0' : 'from-amber-500/0 via-amber-500/10 to-amber-500/0'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                          
                          <div className="relative">
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h3 className={`font-bold ${theme.textPrimary} text-lg truncate transition-colors duration-300`}>
                                  {list?.studentName || 'Unknown User'}
                                </h3>
                                <div className="flex items-center mt-2">
                                  <span className={`${theme.pendingBg} ${theme.pendingText} text-xs font-medium px-3 py-1 rounded-full border ${theme.pendingBorder}`}>
                                    Needs Verification
                                  </span>
                                </div>
                              </div>
                              <div className={`w-10 h-10 bg-gradient-to-br ${isDarkMode ? 'from-amber-500/20 to-orange-500/20' : 'from-amber-100 to-amber-200'} rounded-lg border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-300'} flex items-center justify-center`}>
                                <svg className={`w-5 h-5 ${theme.pendingText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>

                            <div className="space-y-3 mb-6">
                              {list?.serialNumber && (
                                <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-xl`}>
                                  <span className={`text-sm ${theme.textSecondary}`}>Serial No.</span>
                                  <span className={`font-medium ${theme.textPrimary} font-mono`}>{list.serialNumber}</span>
                                </div>
                              )}
                              {list?.model && (
                                <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-xl`}>
                                  <span className={`text-sm ${theme.textSecondary}`}>Model</span>
                                  <span className={`font-medium ${theme.textPrimary}`}>{list.model}</span>
                                </div>
                              )}
                              {list?.registrationDate && (
                                <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-xl`}>
                                  <span className={`text-sm ${theme.textSecondary}`}>Registered</span>
                                  <span className={`font-medium ${theme.textSecondary}`}>{list.registrationDate}</span>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => navigate(`/verify/${list.id}`)}
                              className={`w-full bg-gradient-to-r ${isDarkMode ? 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' : 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white py-3 rounded-xl font-bold transition-all duration-300 ${isDarkMode ? 'shadow-lg hover:shadow-amber-500/25' : 'shadow-md hover:shadow-lg'} flex items-center justify-center group/btn`}
                            >
                              <svg className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Review Device
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  )
}

export default Dashboard