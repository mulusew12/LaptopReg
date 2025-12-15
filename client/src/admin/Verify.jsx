import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';

const Verify = () => {
    const { lists, setLists, axios } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // Enhanced ID matching function
    const findLaptopById = () => {
        if (!lists || !id) return null;
        
        return lists.find((item) => {
            // Handle string IDs from MongoDB
            if (item.id === id) return true;
            
            // Handle numeric IDs from dummy data (convert both to string for comparison)
            if (String(item._id) === String(id)) return true;
            
            // Handle case where ID might be in a different property
            if (item.id && item.id === id) return true;
            
            return false;
        });
    };
    
    const list = findLaptopById();
    
    // Debug log to see what's happening
    useEffect(() => {
        console.log("Current ID:", id);
        console.log("Type of ID:", typeof id);
        console.log("Available laptops:", lists?.map(l => ({ id: l.id, type: typeof l.id })));
    }, [id, lists]);
    
    // Function to verify laptop via backend API
    const handleVerify = async () => {
        if (!list) return;
        
        try {
            setIsLoading(true);
            
            // Call backend API to verify
            const response = await axios.put(`/api/laptops/${list.id}/verify`);
            
            // Update local state with backend response
            const updatedLists = lists.map(item => {
                if (item.id === list.id) {
                    return response.data; // Use data from backend
                }
                return item;
            });
            
            setLists(updatedLists);
            toast.success('Laptop verified successfully!');
            navigate('/list');
            
        } catch (error) {
            console.error('Verification failed:', error);
            toast.error('Failed to verify laptop');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Function to unverify laptop via backend API
    const handleUnverify = async () => {
        if (!list) return;
        
        try {
            setIsLoading(true);
            
            // Since you don't have an unverify endpoint, we'll update locally
            // Option 1: Create a new API endpoint for unverify
            // const response = await axios.put(`/api/laptops/${list.id}/unverify`);
            
            // Option 2: Update locally (for now)
            const updatedLists = lists.map(item => {
                if (item.id === list.id) {
                    return { ...item, verified: false };
                }
                return item;
            });
            
            setLists(updatedLists);
            toast.success('Laptop marked as unverified!');
            navigate('/list');
            
        } catch (error) {
            console.error('Unverification failed:', error);
            toast.error('Failed to unverify laptop');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Function to delete laptop
    const handleDelete = async () => {
        if (!list) return;
        
        if (!window.confirm('Are you sure you want to delete this laptop registration?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Call backend API to delete
            await axios.delete(`/api/laptops/${list.id}`);
            
            // Remove from local state
            const updatedLists = lists.filter(item => item.id !== list.id);
            
            setLists(updatedLists);
            toast.success('Laptop registration deleted successfully!');
            navigate('/list');
            
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Failed to delete laptop');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className='p-4 md:p-8 lg:p-12 min-h-screen bg-gray-50'>
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b-4 border-indigo-500 pb-2 inline-block">
                    💻 Laptop Verification Center
                </h1>
            </header>

            {/* --- Laptop Found / Details Card --- */}
            {list ? (
                <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">
                        <span className="mr-2">📝</span> Details for student ID: <span className='bg-green-200 px-3'>{list.studentId.toUpperCase()}</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-8">
                        {/* Student Name */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Name</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{list.studentName}</p>
                        </div>
                        {/* Student ID */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student ID</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{list.studentId}</p>
                        </div>
                        {/* Verification Status */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Verification Status</p>
                            <span className={`inline-flex items-center gap-2 px-3 py-1 mt-1 rounded-full text-base font-bold ${
                                list.verified 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                                {list.verified ? 'Verified' : 'Not Verified'}
                                {list.verified ? ' ✅' : ' ❌'}
                            </span>
                        </div>
                        
                        {/* Separator for Laptop Specs */}
                        <div className="col-span-full border-t border-dashed border-gray-200 mt-4 pt-4">
                            <p className="text-base font-semibold text-gray-700">Hardware & System Specs</p>
                        </div>

                        {/* Serial Number */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Serial Number</p>
                            <p className="text-lg font-medium text-gray-700 mt-1">{list.serialNumber}</p>
                        </div>
                        {/* MAC Address */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">MAC Address</p>
                            <p className="text-lg font-medium text-gray-700 mt-1">{list.macAddress}</p>
                        </div>
                        {/* Brand */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Brand</p>
                            <p className="text-lg font-medium text-gray-700 mt-1">{list.laptopBrand}</p>
                        </div>
                        {/* Operating System */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Operating System</p>
                            <p className="text-lg font-medium text-gray-700 mt-1">{list.operatingSystem}</p>
                        </div>
                        {/* Antivirus Installed */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Antivirus Installed</p>
                            <p className={`text-lg font-bold mt-1 ${list.antiVirusInstalled ? 'text-green-600' : 'text-red-600'}`}>
                                {list.antiVirusInstalled ? 'Yes, Secured' : 'No, Warning'}
                                {list.antiVirusInstalled ? ' 🛡️' : ' ⚠️'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                        {/* Back Button */}
                        <button 
                            onClick={() => navigate('/list')}
                            disabled={isLoading}
                            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold shadow-sm disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to List
                        </button>
                        
                        {/* Delete Button (Danger) */}
                        <button 
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Registration
                        </button>
                        
                        {/* Verification/Unverification Button */}
                        {!list.verified ? (
                            <button 
                                onClick={handleVerify}
                                disabled={isLoading}
                                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Verify Laptop
                                    </>
                                )}
                            </button>
                        ) : (
                            <button 
                                onClick={handleUnverify}
                                disabled={isLoading}
                                className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Mark as Unverified
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* --- Laptop Not Found Card --- */
                <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 border-t-4 border-yellow-500">
                    <div className="flex items-center mb-4">
                        <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <h2 className="text-2xl font-bold text-yellow-800">Laptop Not Found</h2>
                    </div>
                    <p className="text-lg text-yellow-700 mb-4">
                        No laptop entry found with the specified ID: **{id}**.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 p-2 border border-dashed rounded bg-gray-50">
                        **Available IDs:** {lists?.map(l => l.id).join(', ')}
                    </p>
                    <button 
                        onClick={() => navigate('/list')}
                        className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                    >
                        Go Back to List
                    </button>
                </div>
            )}
        </div>
    );
}

export default Verify;