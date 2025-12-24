import React, { useState, useMemo } from 'react'
import { useAppContext } from '../auth/Context'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { lists } = useAppContext()
  const [selected, setSelected] = useState("")
  const navigate = useNavigate()
  
  const unverified = useMemo(() => {
    return lists.filter(list => list.verified === false)
  }, [lists])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4   pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT MENU - Enhanced Card Design */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800">Dashboard Menu</h2>
                <p className="text-sm text-gray-600 mt-1">Manage laptop registrations</p>
              </div>
              
              <div className="p-3 space-y-3">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 cursor-pointer p-4 rounded-xl transition-all duration-200 flex items-center justify-between group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-bold text-white group-hover:text-white">
                      Register New Laptop
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelected('new')}
                  className="w-full text-left bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 cursor-pointer p-4 rounded-xl transition-all duration-200 flex items-center justify-between group shadow-md hover:shadow-lg relative"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-white">
                        Unverified Laptops
                      </span>
                      <p className="text-sm text-white/80">Pending approval</p>
                    </div>
                  </div>
                  {unverified.length > 0 && (
                    <span className="bg-white text-orange-600 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {unverified.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/list')}
                  className="w-full text-left bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 cursor-pointer p-4 rounded-xl transition-all duration-200 flex items-center justify-between group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">
                      All Laptops List
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Card - Enhanced Design */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-gray-800 font-bold text-lg mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Total Laptops</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{lists.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Unverified</span>
                  </div>
                  <span className="font-bold text-red-700 text-lg">{unverified.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Verified</span>
                  </div>
                  <span className="font-bold text-green-700 text-lg">{lists.length - unverified.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Enhanced Main Panel */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Manage and monitor laptop registrations</p>
                  </div>
                  {selected === "new" && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          {unverified.length} Unverified Laptop{unverified.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DEFAULT WELCOME VIEW - Enhanced */}
              {!selected && (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Laptop Management</h2>
                  <p className="text-gray-600 max-w-lg mx-auto text-lg mb-8">
                    Streamline laptop registration, verification, and tracking in one centralized dashboard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => navigate('/register')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      Start Registration
                    </button>
                    <button
                      onClick={() => setSelected('new')}
                      className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      View Unverified Laptops
                    </button>
                  </div>
                </div>
              )}

              {/* NEW LAPTOPS LIST - Enhanced Grid */}
              {selected === "new" && (
                <div className="p-6">
                  {unverified.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">All Laptops Verified</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">No pending verifications. Great work!</p>
                      <button
                        onClick={() => navigate('/register')}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                      >
                        Register New Laptop
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {unverified.map((list, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-xl p-5 hover:border-red-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-red-50/30 hover:to-red-50/50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h2 className="font-bold text-gray-900 text-lg">{list?.studentName || 'Unknown User'}</h2>
                              <p className="text-gray-500 text-sm">Requires verification</p>
                            </div>
                            <span className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                              Unverified
                            </span>
                          </div>
                          <div className="space-y-3 mb-5">
                            {list?.serialNumber && (
                              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 font-medium">Serial Number:</span>
                                <span className="font-bold text-gray-900">{list.serialNumber}</span>
                              </div>
                            )}
                            {list?.model && (
                              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 font-medium">Model:</span>
                                <span className="font-bold text-gray-900">{list.model}</span>
                              </div>
                            )}
                            {list?.registrationDate && (
                              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 font-medium">Registered:</span>
                                <span className="font-medium text-gray-700">{list.registrationDate}</span>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => navigate(`/verify/${list.id}`)}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verify Now
                          </button>
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
    </div>
  )
}

export default Dashboard