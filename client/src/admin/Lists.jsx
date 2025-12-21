import React, { useState } from 'react';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';

const Lists = () => {
  const navigate = useNavigate()
  const { lists, searchTerm, setSearchTerm, filteredLists, setSelectedBrand, setSelectedOS, selectedBrand, selectedOS } = useAppContext();

  if (!lists || lists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Same empty state as above */}
      </div>
    );
  }

  const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log('Copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

  // Filter lists

  // Get unique brands and OS for filters
  const uniqueBrands = ['All', ...new Set(lists.map(list => list?.laptopBrand).filter(Boolean))];
  const uniqueOS = ['All', ...new Set(lists.map(list => list?.operatingSystem).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 py-8  ">
      <div className="">
        {/* Header with filters */}
        <div className="fixed border-b-2 border-blue-900 z-100 bg-gray-50 top-0 w-full p-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registered Laptops</h1>
          <p className="text-gray-600 mb-6">Manage and view all registered laptops in your system</p>
          <button onClick={() => navigate('/')} className="px-14 py-2 fixed top-20 right-6 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            Back
          </button>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by user, serial, or MAC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* OS Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OS</label>
                <select
                  value={selectedOS}
                  onChange={(e) => setSelectedOS(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uniqueOS.map(os => (
                    <option key={os} value={os}>{os}</option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="bg-blue-50 px-4 py-2 rounded-md w-full">
                  <div className="text-sm text-gray-600">Showing</div>
                  <div className="text-xl font-bold text-blue-600">
                    {filteredLists.length} of {lists.length} laptops
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl pt-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500">
                <tr className=''>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">OS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Antivirus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">IN/OUT</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                {filteredLists.map((list, index) => (
                  <tr key={list?.id} className="hover:bg-gray-50 transition-colors">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => navigate(`/verify/${list?.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {list?.studentName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{list?.studentName}</div>
                          <div className="text-sm text-gray-500">UID: {list?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{list?.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {list?.laptopBrand}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {list?.operatingSystem === 'Windows' && (
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            {/* Windows icon SVG */}
                          </svg>
                        )}
                        <span className="text-sm text-gray-900">{list?.operatingSystem}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                          {list?.phone}
                        </code>
                        <button
                          onClick={() => copyToClipboard(list?.phone)}
                          className="ml-2 text-gray-400 hover:text-blue-600"
                          title="Copy"
                        >

                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {list?.antiVirusInstalled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Protected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Unprotected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {list?.verified ? <span className='text-green-600  p-2'>Yes</span> : <span className='text-red-700 p-2'>No</span>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export/Print Options */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredLists.length} of {lists.length} results
          </div>
          <div className="flex space-x-3">

            <button onClick={() => navigate('/')} className="px-14 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Lists;