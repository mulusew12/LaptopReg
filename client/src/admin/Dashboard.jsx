import React, { useState, useMemo } from 'react'
import { useAppContext } from '../auth/Context'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { lists } = useAppContext()
  const [selected, setSelected] = useState("")
  const navigate = useNavigate()
  
  // Corrected the filter function - added return statement and fixed comparison operator
  const unverified = useMemo(() => {
    return lists.filter(list => list.verified === false)
  }, [lists])

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-30 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT MENU */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Dashboard Menu</h2>
              </div>
              
              <div className="p-2 gap-12 flex flex-col ">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full text-left bg-blue-600 border-3 border-blue-800 cursor-pointer p-4 hover:bg-blue-500   transition-colors duration-200 flex items-center justify-between group"
                >
                  <span className="text-white group-hover:text-gray-100 font-bold">
                    Register new laptop
                  </span>
                  <svg className="w-5 h-5 text-gray-100 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelected('new')}
                  className="w-full text-left bg-amber-500 border-3 border-amber-700 cursor-pointer p-4 hover:bg-amber-400  transition-colors duration-200 flex items-center justify-between group relative"
                >
                  <div>
                    <span className="text-gray-100 group-hover:text-gray-100 font-bold">
                      Unverified Laptops
                    </span>
                 </div>
                  {unverified.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-1 rounded-full">
                      {unverified.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/list')}
                  className="w-full text-left p-4 border-3 border-green-900  cursor-pointer bg-green-800 hover:bg-green-700  transition-colors duration-200 flex items-center justify-between group"
                >
                  <span className="text-gray-100 group-hover:text-gray-100 font-bold">
                    All laptops list
                  </span>
                  <svg className="w-5 h-5 text-gray-200 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-300 p-5">
              <h3 className="text-gray-800 font-medium mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Laptops</span>
                  <span className="font-semibold text-gray-800">{lists.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unverified</span>
                  <span className="font-semibold text-red-600">{unverified.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified</span>
                  <span className="font-semibold text-green-600">{lists.length - unverified.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                {selected === "new" && (
                  <span className="text-sm text-gray-600">
                    Showing {unverified.length} unverified laptop{unverified.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* DEFAULT WELCOME VIEW */}
              {!selected && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Laptop Management</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Select an option from the menu to view or manage laptop registrations and verifications.
                  </p>
                </div>
              )}

              {/* NEW LAPTOPS LIST */}
              {selected === "new" && (
                <div>
                  {unverified.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">All laptops verified</h3>
                      <p className="text-gray-500">No unverified laptops found. All systems are up to date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unverified.map((list, index) => (
                        <div
                          key={index}
                          className="border border-gray-400 rounded-lg p-4 hover:border-red-200 hover:bg-red-50 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h2 className="font-semibold text-gray-800">{list?.studentName || 'Unknown User'}</h2>
                          </div>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                              Unverified
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            {list?.serialNumber && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Serial:</span>
                                <span className="font-medium">{list.serialNumber}</span>
                              </div>
                            )}
                            {list?.model && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Model:</span>
                                <span className="font-medium">{list.model}</span>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => navigate(`/verify/${list.id}`)}
                            className="w-full mt-4 text-sm bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg transition-colors duration-200 font-medium"
                          >
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